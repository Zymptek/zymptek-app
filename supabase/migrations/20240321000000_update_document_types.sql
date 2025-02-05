-- Drop the existing constraint
ALTER TABLE company_documents DROP CONSTRAINT IF EXISTS valid_document_type;

-- Add the new constraint with our document types
ALTER TABLE company_documents 
ADD CONSTRAINT valid_document_type 
CHECK (document_type IN ('gst', 'iec', 'quality')); 