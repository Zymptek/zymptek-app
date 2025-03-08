-- Add is_featured column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_trending_products(INTEGER);

-- Create the function to get trending products
CREATE FUNCTION get_trending_products(_limit INTEGER DEFAULT 6)
RETURNS TABLE (
  product_id UUID,
  headline TEXT,
  description TEXT,
  image_urls TEXT[],
  category_id UUID,
  views_count BIGINT,
  unique_viewers BIGINT,
  is_featured BOOLEAN,
  created_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.product_id,
    p.headline,
    p.description,
    p.image_urls,
    p.category_id,
    COUNT(pv.id)::BIGINT as views_count,
    COUNT(DISTINCT COALESCE(pv.viewer_id, pv.ip_address))::BIGINT as unique_viewers,
    p.is_featured,
    p.created_at,
    MAX(pv.viewed_at)::TIMESTAMPTZ as last_viewed_at
  FROM products p
  LEFT JOIN product_views pv ON p.product_id = pv.product_id
  WHERE p.is_featured = true
  GROUP BY p.product_id
  -- Order by a combination of recent views and total unique viewers
  ORDER BY 
    MAX(pv.viewed_at) DESC NULLS LAST,
    COUNT(DISTINCT COALESCE(pv.viewer_id, pv.ip_address)) DESC,
    p.created_at DESC
  LIMIT _limit;
END;
$$; 