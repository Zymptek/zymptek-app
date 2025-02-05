-- Enable RLS on seller_verification_records
ALTER TABLE seller_verification_records ENABLE ROW LEVEL SECURITY;

-- Policy for inserting records (sellers can insert their own records)
CREATE POLICY "sellers_can_insert_own_verification_records" ON seller_verification_records
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for viewing records (sellers can view their own records)
CREATE POLICY "sellers_can_view_own_verification_records" ON seller_verification_records
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for updating records (only admins can update)
CREATE POLICY "admins_can_update_verification_records" ON seller_verification_records
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE user_id = auth.uid() 
      AND UPPER(user_type) = 'ADMIN'
    )
  );

-- Policy for deleting records (only admins can delete)
CREATE POLICY "admins_can_delete_verification_records" ON seller_verification_records
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE user_id = auth.uid() 
      AND UPPER(user_type) = 'ADMIN'
    )
  ); 