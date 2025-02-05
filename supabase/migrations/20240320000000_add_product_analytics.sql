-- Create product_views table to track individual views
CREATE TABLE IF NOT EXISTS product_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id), -- Optional, for authenticated users
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT, -- For anonymous views
    user_agent TEXT -- For analytics
);

-- Add analytics columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS orders_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP WITH TIME ZONE;

-- Function to record a product view
CREATE OR REPLACE FUNCTION record_product_view(
    _product_id UUID,
    _viewer_id UUID DEFAULT NULL,
    _ip_address TEXT DEFAULT NULL,
    _user_agent TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Insert view record
    INSERT INTO product_views (product_id, viewer_id, ip_address, user_agent)
    VALUES (_product_id, _viewer_id, _ip_address, _user_agent);

    -- Update product view count and last viewed timestamp
    UPDATE products
    SET 
        views_count = views_count + 1,
        last_viewed_at = NOW()
    WHERE product_id = _product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get product analytics
CREATE OR REPLACE FUNCTION get_product_analytics(
    _product_id UUID
) RETURNS TABLE (
    total_views INTEGER,
    unique_viewers INTEGER,
    conversion_rate DECIMAL,
    last_viewed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.views_count AS total_views,
        COUNT(DISTINCT pv.viewer_id)::INTEGER AS unique_viewers,
        CASE 
            WHEN p.views_count > 0 THEN 
                (p.orders_count::DECIMAL / p.views_count::DECIMAL * 100)
            ELSE 0 
        END AS conversion_rate,
        p.last_viewed_at AS last_viewed
    FROM products p
    LEFT JOIN product_views pv ON p.product_id = pv.product_id
    WHERE p.product_id = _product_id
    GROUP BY p.views_count, p.orders_count, p.last_viewed_at;
END;
$$ LANGUAGE plpgsql;

-- Function to get seller product analytics
CREATE OR REPLACE FUNCTION get_seller_product_analytics(
    _seller_id UUID
) RETURNS TABLE (
    total_products INTEGER,
    total_views INTEGER,
    total_orders INTEGER,
    overall_conversion_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT p.product_id)::INTEGER AS total_products,
        SUM(p.views_count)::INTEGER AS total_views,
        SUM(p.orders_count)::INTEGER AS total_orders,
        CASE 
            WHEN SUM(p.views_count) > 0 THEN 
                (SUM(p.orders_count)::DECIMAL / SUM(p.views_count)::DECIMAL * 100)
            ELSE 0 
        END AS overall_conversion_rate
    FROM products p
    WHERE p.seller_id = _seller_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get top performing products for a seller
CREATE OR REPLACE FUNCTION get_top_performing_products(
    _seller_id UUID,
    _limit INTEGER DEFAULT 5
) RETURNS TABLE (
    product_id UUID,
    headline TEXT,
    views_count INTEGER,
    orders_count INTEGER,
    conversion_rate DECIMAL,
    last_viewed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.product_id,
        p.headline,
        p.views_count,
        p.orders_count,
        CASE 
            WHEN p.views_count > 0 THEN 
                (p.orders_count::DECIMAL / p.views_count::DECIMAL * 100)
            ELSE 0 
        END AS conversion_rate,
        p.last_viewed_at
    FROM products p
    WHERE p.seller_id = _seller_id
    ORDER BY p.views_count DESC, p.last_viewed_at DESC
    LIMIT _limit;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewers can insert their own views"
    ON product_views FOR INSERT
    TO authenticated
    WITH CHECK (
        viewer_id = auth.uid() OR 
        viewer_id IS NULL
    );

CREATE POLICY "Sellers can view their product views"
    ON product_views FOR SELECT
    TO authenticated
    USING (
        product_id IN (
            SELECT product_id 
            FROM products 
            WHERE seller_id = auth.uid()
        )
    ); 