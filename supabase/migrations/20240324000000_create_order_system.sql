-- Create custom types for order system
CREATE TYPE incoterm_type AS ENUM (
  'FOB',  -- Free On Board
  'CIF',  -- Cost, Insurance, and Freight
  'EXW',  -- Ex Works
  'DDP'   -- Delivered Duty Paid
);

CREATE TYPE payment_method_type AS ENUM (
  'bank_transfer',
  'letter_of_credit',
  'escrow'
);

CREATE TYPE order_status_type AS ENUM (
  'created',     -- Order created by buyer
  'confirmed',   -- Order confirmed by seller
  'shipped',     -- Order shipped by seller
  'delivered',   -- Order delivered to buyer
  'completed',   -- Order completed (final payment released)
  'cancelled'    -- Order cancelled
);

-- Create helper function for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES profiles(user_id) NOT NULL,
  seller_id UUID REFERENCES profiles(user_id) NOT NULL,
  product_id UUID REFERENCES products(product_id) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  agreed_price DECIMAL NOT NULL CHECK (agreed_price > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  incoterm incoterm_type NOT NULL,
  delivery_date TIMESTAMPTZ NOT NULL,
  payment_method payment_method_type NOT NULL,
  status order_status_type NOT NULL DEFAULT 'created',
  linked_chat_id UUID REFERENCES conversations(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order documents table
CREATE TABLE order_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('invoice', 'packing_list', 'certificate')),
  document_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(user_id) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order updates table
CREATE TABLE order_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('status_change', 'document_upload', 'inspection')),
  description TEXT,
  updated_by UUID REFERENCES profiles(user_id) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Order participants access"
ON orders
FOR ALL
USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Document access for order participants"
ON order_documents
FOR ALL
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE id = order_id 
  AND (buyer_id = auth.uid() OR seller_id = auth.uid())
));

CREATE POLICY "Update access for order participants"
ON order_updates
FOR ALL
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE id = order_id 
  AND (buyer_id = auth.uid() OR seller_id = auth.uid())
));

-- Create trigger for updating timestamps
CREATE TRIGGER update_orders_modified
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Create indexes for better query performance
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_order_documents_order_id ON order_documents(order_id);
CREATE INDEX idx_order_updates_order_id ON order_updates(order_id); 