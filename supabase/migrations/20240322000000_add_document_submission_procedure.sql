-- Create document submission procedure
CREATE OR REPLACE FUNCTION handle_document_submission(
  p_company_id UUID,
  p_document_types TEXT[]
) RETURNS void AS $$
BEGIN
  -- Update company status
  UPDATE companies
  SET 
    verification_status = 'applied',
    updated_at = NOW()
  WHERE id = p_company_id;

  -- Create verification record
  INSERT INTO seller_verification_records (
    company_id,
    verification_type,
    status,
    submitted_at
  ) VALUES (
    p_company_id,
    'business',
    'applied',
    NOW()
  );

  -- Update existing document statuses
  UPDATE company_documents
  SET verification_status = 'applied'
  WHERE company_id = p_company_id
  AND document_type = ANY(p_document_types);
END;
$$ LANGUAGE plpgsql; 