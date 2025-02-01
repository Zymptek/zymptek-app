-- Add special_instructions column to orders table
ALTER TABLE orders ADD COLUMN special_instructions TEXT;

-- Add comment to the column
COMMENT ON COLUMN orders.special_instructions IS 'Optional special instructions or notes for the order'; 