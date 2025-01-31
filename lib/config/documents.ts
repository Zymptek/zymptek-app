import { z } from "zod";

export interface DocumentConfig {
  type: string;
  name: string;
  description: string;
  required: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

// Document configuration that will be used across the application
export const DOCUMENT_CONFIG: DocumentConfig[] = [
  {
    type: "gst",
    name: "GST Certificate",
    description: "Upload your GST registration certificate",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: [".pdf"]
  },
  {
    type: "iec",
    name: "IEC Code",
    description: "Upload your Import Export Code (IEC)",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: [".pdf"]
  },
  {
    type: "quality",
    name: "Quality Certification",
    description: "Upload your quality inspection certificate",
    required: false,
    maxSizeMB: 5,
    acceptedTypes: [".pdf"]
  }
];

// Helper function to get required document types
export const getRequiredDocumentTypes = () => 
  DOCUMENT_CONFIG.filter(doc => doc.required).map(doc => doc.type);

// Zod schema for document validation
export const documentSchema = z.object({
  type: z.string(),
  url: z.string().url(),
  name: z.string(),
  required: z.boolean().optional()
});

// Create a Zod schema for documents based on the config
export const createDocumentsSchema = () => {
  const requiredTypes = getRequiredDocumentTypes();
  
  return z.array(documentSchema).refine(
    (docs) => {
      // Check if all required documents are present
      return requiredTypes.every(type => 
        docs.some(doc => doc.type === type)
      );
    },
    {
      message: "All required documents must be uploaded"
    }
  );
};

// Utility function to validate file
export const validateFile = (file: File, config: DocumentConfig) => {
  const errors: string[] = [];

  // Check file size
  if (config.maxSizeMB && file.size > config.maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${config.maxSizeMB}MB`);
  }

  // Check file type
  if (config.acceptedTypes && config.acceptedTypes.length > 0) {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!config.acceptedTypes.includes(fileExt)) {
      errors.push(`File must be one of: ${config.acceptedTypes.join(', ')}`);
    }
  }

  return errors;
}; 
