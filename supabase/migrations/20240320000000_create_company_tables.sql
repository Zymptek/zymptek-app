-- Drop existing tables if they exist
DROP TABLE IF EXISTS seller_verification_records CASCADE;
DROP TABLE IF EXISTS company_documents CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Create verification status enum
DROP TYPE IF EXISTS verification_status_enum CASCADE;
CREATE TYPE verification_status_enum AS ENUM ('not_applied', 'applied', 'pending', 'approved');

-- Create new companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    website TEXT,
    logo_url TEXT,
    poster_url TEXT,
    business_category TEXT,
    year_established DATE,
    employee_count INTEGER,
    main_products TEXT[],
    certifications TEXT[],
    production_capacity JSONB,
    social_media JSONB,
    verification_status verification_status_enum DEFAULT 'not_applied',
    verification_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company documents table
CREATE TABLE IF NOT EXISTS company_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    verification_status verification_status_enum DEFAULT 'not_applied',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_document_type CHECK (document_type IN ('business_license', 'tax_certificate', 'quality_certification', 'other'))
);

-- Create seller verifications table
CREATE TABLE IF NOT EXISTS seller_verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL,
    status verification_status_enum DEFAULT 'not_applied',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verifier_id UUID,
    notes TEXT,
    CONSTRAINT valid_verification_type CHECK (verification_type IN ('business', 'identity', 'quality', 'other'))
);

-- Add company_id to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'company_id'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN company_id UUID REFERENCES companies(id);
    END IF;
END $$;

-- Function to migrate existing company profile data
CREATE OR REPLACE FUNCTION migrate_company_profiles()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    new_company_id UUID;
    migration_count INTEGER := 0;
BEGIN
    -- Log start of migration
    RAISE NOTICE 'Starting company profile migration...';

    -- First, let's count how many records need migration
    SELECT COUNT(*)
    INTO migration_count
    FROM profiles 
    WHERE UPPER(user_type) = 'SELLER' 
    AND company_profile IS NOT NULL 
    AND company_id IS NULL;

    RAISE NOTICE 'Found % profiles to migrate', migration_count;

    -- Proceed with migration
    FOR profile_record IN 
        SELECT p.id, p.user_id, p.company_profile, p.business_category
        FROM profiles p
        WHERE UPPER(p.user_type) = 'SELLER' 
        AND p.company_profile IS NOT NULL 
        AND p.company_id IS NULL
    LOOP
        RAISE NOTICE 'Migrating profile %: %', profile_record.id, profile_record.company_profile->>'company_name';

        -- Insert into companies table
        INSERT INTO companies (
            name,
            description,
            address,
            website,
            logo_url,
            poster_url,
            business_category,
            year_established,
            employee_count,
            main_products,
            production_capacity,
            social_media,
            verification_status
        )
        VALUES (
            COALESCE(profile_record.company_profile->>'company_name', 'Unnamed Company'),
            profile_record.company_profile->>'company_description',
            profile_record.company_profile->>'company_address',
            profile_record.company_profile->>'website',
            profile_record.company_profile->>'company_logo_url',
            profile_record.company_profile->>'company_poster_url',
            profile_record.business_category,
            CASE 
                WHEN profile_record.company_profile->'overview'->>'yearEstablished' IS NOT NULL 
                THEN 
                    CASE 
                        WHEN (profile_record.company_profile->'overview'->>'yearEstablished')::text ~ '^\d{4}-\d{2}-\d{2}' 
                        THEN (profile_record.company_profile->'overview'->>'yearEstablished')::date
                        WHEN (profile_record.company_profile->'overview'->>'yearEstablished')::text ~ '^\d{4}-\d{2}-\d{2}T' 
                        THEN ((profile_record.company_profile->'overview'->>'yearEstablished')::timestamp)::date
                        ELSE NULL 
                    END
                ELSE NULL 
            END,
            CASE 
                WHEN (profile_record.company_profile->'overview'->>'totalEmployees') IS NOT NULL 
                AND (profile_record.company_profile->'overview'->>'totalEmployees')::text ~ '^\d+$'
                THEN (profile_record.company_profile->'overview'->>'totalEmployees')::integer 
                ELSE NULL 
            END,
            CASE
                WHEN profile_record.company_profile->'overview'->'categories' IS NOT NULL 
                THEN ARRAY(SELECT jsonb_array_elements_text(profile_record.company_profile->'overview'->'categories'))
                WHEN profile_record.company_profile->'overview'->>'mainProducts' IS NOT NULL
                THEN ARRAY[profile_record.company_profile->'overview'->>'mainProducts']
                ELSE NULL
            END,
            CASE 
                WHEN profile_record.company_profile->'productionCapacity' IS NOT NULL 
                THEN profile_record.company_profile->'productionCapacity'
                ELSE '{}'::jsonb 
            END,
            CASE 
                WHEN profile_record.company_profile->'social_media' IS NOT NULL 
                THEN profile_record.company_profile->'social_media'
                ELSE '{}'::jsonb 
            END,
            'not_applied'::verification_status_enum
        )
        RETURNING id INTO new_company_id;

        -- Update profile with new company_id
        UPDATE profiles 
        SET 
            company_id = new_company_id,
            updated_at = NOW()
        WHERE id = profile_record.id;

        -- Create verification record
        INSERT INTO seller_verification_records (
            company_id,
            verification_type,
            status,
            verified_at
        )
        VALUES (
            new_company_id,
            'business',
            'not_applied',
            NULL
        );

        RAISE NOTICE 'Successfully migrated profile % to company %', profile_record.id, new_company_id;
    END LOOP;

    -- Log completion
    SELECT COUNT(*)
    INTO migration_count
    FROM profiles 
    WHERE UPPER(user_type) = 'SELLER' 
    AND company_profile IS NOT NULL 
    AND company_id IS NOT NULL;

    RAISE NOTICE 'Migration completed. % profiles now have company_id', migration_count;
END;
$$ LANGUAGE plpgsql;

-- Run the migration immediately
DO $$ 
BEGIN
    -- Drop existing data first
    RAISE NOTICE 'Cleaning up existing data...';
    DELETE FROM seller_verification_records;
    DELETE FROM company_documents;
    DELETE FROM companies;
    
    -- Reset company_id in profiles
    UPDATE profiles 
    SET company_id = NULL 
    WHERE UPPER(user_type) = 'SELLER';
    
    -- Run migration
    RAISE NOTICE 'Starting fresh migration...';
    PERFORM migrate_company_profiles();
END $$;

-- Create function to handle seller conversion
CREATE OR REPLACE FUNCTION convert_to_seller(
    profile_id UUID,
    company_data JSONB
)
RETURNS UUID AS $$
DECLARE
    new_company_id UUID;
BEGIN
    -- Insert new company
    INSERT INTO companies (
        name,
        description,
        address,
        website,
        business_category,
        year_established,
        employee_count,
        main_products,
        verification_status
    )
    VALUES (
        company_data->>'name',
        company_data->>'description',
        company_data->>'address',
        company_data->>'website',
        company_data->>'business_category',
        (company_data->>'year_established')::date,
        (company_data->>'employee_count')::integer,
        ARRAY(SELECT jsonb_array_elements_text(company_data->'main_products')),
        'not_applied'::verification_status_enum
    )
    RETURNING id INTO new_company_id;

    -- Update profile
    UPDATE profiles 
    SET 
        user_type = 'SELLER',
        company_id = new_company_id,
        updated_at = NOW()
    WHERE id = profile_id;

    -- Create initial verification record
    INSERT INTO seller_verification_records (
        company_id,
        verification_type,
        status
    )
    VALUES (
        new_company_id,
        'business',
        'not_applied'
    );

    RETURN new_company_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update companies.updated_at
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS companies_updated_at ON companies;
CREATE TRIGGER companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_updated_at();

-- Migrate existing data
SELECT migrate_company_profiles();

-- Add RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_verification_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public companies are viewable by everyone" ON companies;
DROP POLICY IF EXISTS "Companies can be updated by authenticated seller owners" ON companies;
DROP POLICY IF EXISTS "Documents are viewable by everyone" ON company_documents;
DROP POLICY IF EXISTS "Documents can be inserted by authenticated seller owners" ON company_documents;
DROP POLICY IF EXISTS "Verifications are viewable by authenticated users" ON seller_verification_records;
DROP POLICY IF EXISTS "Verifications can be updated by admin" ON seller_verification_records;

-- Companies policies
CREATE POLICY "Public companies are viewable by everyone"
    ON companies FOR SELECT
    USING (true);

CREATE POLICY "Companies can be updated by authenticated seller owners"
    ON companies FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM profiles 
            WHERE company_id = companies.id
        )
    );

-- Documents policies
CREATE POLICY "Documents are viewable by everyone"
    ON company_documents FOR SELECT
    USING (true);

CREATE POLICY "Documents can be inserted by authenticated seller owners"
    ON company_documents FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id 
            FROM profiles 
            WHERE company_id = company_documents.company_id
        )
    );

-- Verifications policies
CREATE POLICY "Verifications are viewable by authenticated users"
    ON seller_verification_records FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Verifications can be updated by admin"
    ON seller_verification_records FOR UPDATE
    USING (auth.role() = 'service_role');

-- Add verification function
CREATE OR REPLACE FUNCTION verify_company_migration()
RETURNS TABLE (
    total_sellers BIGINT,
    migrated_companies BIGINT,
    unmigrated_sellers BIGINT,
    verification_records BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) FILTER (WHERE UPPER(user_type) = 'SELLER') as total_sellers,
            COUNT(*) FILTER (WHERE UPPER(user_type) = 'SELLER' AND company_id IS NOT NULL) as migrated_companies,
            COUNT(*) FILTER (WHERE UPPER(user_type) = 'SELLER' AND company_id IS NULL) as unmigrated_sellers
        FROM profiles
    ),
    verification_stats AS (
        SELECT COUNT(*) as verification_records
        FROM seller_verification_records
    )
    SELECT 
        stats.total_sellers,
        stats.migrated_companies,
        stats.unmigrated_sellers,
        verification_stats.verification_records
    FROM stats, verification_stats;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy monitoring
DROP VIEW IF EXISTS company_migration_status;
CREATE VIEW company_migration_status AS
SELECT * FROM verify_company_migration();

-- Add function to fix any unmigrated sellers
CREATE OR REPLACE FUNCTION fix_unmigrated_sellers()
RETURNS void AS $$
DECLARE
    status_record RECORD;
BEGIN
    -- Log start
    RAISE NOTICE 'Starting to fix unmigrated sellers...';
    
    -- Attempt to migrate any missed sellers
    PERFORM migrate_company_profiles();
    
    -- Log results
    RAISE NOTICE 'Migration fix completed. Current status:';
    FOR status_record IN SELECT * FROM company_migration_status LOOP
        RAISE NOTICE 'Total Sellers: %, Migrated: %, Unmigrated: %, Verification Records: %',
            status_record.total_sellers,
            status_record.migrated_companies,
            status_record.unmigrated_sellers,
            status_record.verification_records;
    END LOOP;
END;
$$ LANGUAGE plpgsql; 