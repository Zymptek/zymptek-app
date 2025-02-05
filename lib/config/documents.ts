import { z } from "zod";

export interface DocumentConfig {
  type: string;
  name: string;
  description: string;
  required: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  maxSize: number; // in bytes
  allowedTypes: string[];
}

// Document configuration that will be used across the application
export const DOCUMENT_CONFIG: DocumentConfig[] = [
  {
    type: "gst",
    name: "GST Certificate",
    description: "Upload your GST registration certificate",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: [".pdf"],
    maxSize: 5 * 1024 * 1024,
    allowedTypes: [".pdf"]
  },
  {
    type: "iec",
    name: "IEC Code",
    description: "Upload your Import Export Code (IEC)",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: [".pdf"],
    maxSize: 5 * 1024 * 1024,
    allowedTypes: [".pdf"]
  },
  {
    type: "quality",
    name: "Quality Certification",
    description: "Upload your quality inspection certificate",
    required: false,
    maxSizeMB: 5,
    acceptedTypes: [".pdf"],
    maxSize: 5 * 1024 * 1024,
    allowedTypes: [".pdf"]
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
export function validateFile(file: File, config: DocumentConfig): string | null {
  const errors: string[] = [];

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File too large. Maximum size: ${config.maxSize / 1024 / 1024}MB`);
  }

  return errors.length > 0 ? errors[0] : null;
} 
