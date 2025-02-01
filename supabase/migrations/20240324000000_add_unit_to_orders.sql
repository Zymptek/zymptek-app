-- Add unit column to orders table
ALTER TABLE orders
ADD COLUMN unit VARCHAR(10) NOT NULL DEFAULT 'piece';

-- Add check constraint to ensure valid units
ALTER TABLE orders
ADD CONSTRAINT valid_unit_check 
CHECK (unit IN ('kg', 'box', 'piece', 'litre'));

-- Update existing orders to have a default unit if needed
UPDATE orders SET unit = 'piece' WHERE unit IS NULL;

-- Add comment to explain the unit column
COMMENT ON COLUMN orders.unit IS 'The unit of measurement for the order quantity (kg, box, piece, litre)';

-- Revert if needed
-- ALTER TABLE orders DROP COLUMN unit; 