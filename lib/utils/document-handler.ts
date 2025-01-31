import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { validateFile, DocumentConfig } from '@/lib/config/documents';
import { supabase } from '@/lib/supabase';
import { deleteObject, uploadObject } from '@/lib/storage';

export interface DocumentUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filePath?: string;
}

export const handleDocumentStorage = async (
  file: File,
  userId: string,
  documentType: string,
  config: DocumentConfig
): Promise<DocumentUploadResult> => {
  let filePath = '';

  try {
    // Validate config
    if (!config || typeof config !== 'object') {
      console.error('Invalid config:', config);
      return {
        success: false,
        error: 'Invalid document configuration'
      };
    }

    // Validate file
    const validationErrors = validateFile(file, config);
    if (validationErrors.length > 0) {
      console.error('File validation failed:', {
        errors: validationErrors,
        fileType: file.type,
        fileSize: file.size,
        config
      });
      return {
        success: false,
        error: validationErrors.join(', ')
      };
    }

    const fileExt = file.name.split('.').pop();
    filePath = `${userId}/company/details/${documentType}-${Math.random()}.${fileExt}`;

    console.log('Attempting file upload:', {
      bucket: 'company-images',
      filePath,
      fileSize: file.size,
      fileType: file.type,
      documentType,
      configType: config.type
    });

    const { url, error: uploadError } = await uploadObject('company-images', filePath, file);

    if (uploadError || !url) {
      throw uploadError || new Error('Failed to get upload URL');
    }

    return {
      success: true,
      url,
      filePath
    };
  } catch (error) {
    // If we have a filePath and URL, attempt to clean up the uploaded file
    if (filePath) {
      try {
        await deleteObject(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/company-images/${filePath}`);
      } catch (cleanupError) {
        console.error('Failed to cleanup file after error:', cleanupError);
      }
    }

    console.error('Document storage error:', {
      error,
      userId,
      documentType,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      config
    });
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: false,
      error: 'Failed to upload document to storage'
    };
  }
};

export const updateCompanyDocument = async (
  companyId: string,
  documentType: string,
  documentUrl: string,
  fileName: string
) => {
  const supabase = createClientComponentClient<Database>();

  try {
    // Check if document already exists
    const { data: existingDocs, error: fetchError } = await supabase
      .from('company_documents')
      .select('*')
      .eq('company_id', companyId)
      .eq('document_type', documentType);

    if (fetchError) throw fetchError;

    if (existingDocs && existingDocs.length > 0) {
      // Update existing document
      const { error } = await supabase
        .from('company_documents')
        .update({
          document_url: documentUrl,
          uploaded_at: new Date().toISOString(),
          verification_status: 'pending'
        })
        .eq('id', existingDocs[0].id);

      if (error) throw error;
    } else {
      // Create new document
      const { error } = await supabase
        .from('company_documents')
        .insert({
          company_id: companyId,
          document_type: documentType,
          document_url: documentUrl,
          uploaded_at: new Date().toISOString(),
          verification_status: 'pending'
        });

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating company document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const fetchCompanyDocuments = async (companyId: string) => {
  const supabase = createClientComponentClient<Database>();

  try {
    const { data, error } = await supabase
      .from('company_documents')
      .select('*')
      .eq('company_id', companyId);

    if (error) throw error;

    return {
      success: true,
      documents: data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      documents: []
    };
  }
};

export const handleSubmitAllDocuments = async (
  companyId: string,
  documents: { file: File; documentType: string; config: any }[],
  onProgress?: (progress: number) => void
) => {
  // First check if the user has access to this company
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    throw new Error('Not authenticated');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('user_id', user.id)
    .single();

  if (profileError || profile.company_id !== companyId) {
    throw new Error('Unauthorized to submit documents for this company');
  }

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (!company) {
    throw new Error('Company not found');
  }

  // Upload documents to storage first
  const uploadedDocs = [];
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const progress = ((i + 1) / documents.length) * 100;
    onProgress?.(progress);

    try {
      // Upload to storage
      const uploadResult = await handleDocumentStorage(
        doc.file,
        company.id,
        doc.documentType,
        doc.config
      );

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(`Failed to upload ${doc.config.name}`);
      }

      uploadedDocs.push({
        documentType: doc.documentType,
        url: uploadResult.url,
        fileName: doc.file.name
      });
    } catch (error) {
      // If any upload fails, clean up the uploaded files
      for (const uploaded of uploadedDocs) {
        await deleteObject(uploaded.url);
      }
      throw error;
    }
  }

  // Update database records in a transaction
  try {
    // First update document records
    for (const doc of uploadedDocs) {
      const { error: updateError } = await supabase
        .from('company_documents')
        .upsert({
          company_id: companyId,
          document_type: doc.documentType,
          document_url: doc.url,
          verification_status: 'applied',
          uploaded_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }
    }

    // Update company status
    const { error: companyError } = await supabase
      .from('companies')
      .update({
        verification_status: 'applied',
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId);

    if (companyError) {
      throw companyError;
    }

    // Create verification record
    const { error: verificationError } = await supabase
      .from('seller_verification_records')
      .insert({
        company_id: companyId,
        verification_type: 'business',
        status: 'applied',
        submitted_at: new Date().toISOString(),
        notes: `Documents submitted: ${documents.map(d => d.config.name).join(', ')}`
      });

    if (verificationError) {
      throw verificationError;
    }

    return { success: true };
  } catch (error) {
    // If database updates fail, clean up the uploaded files
    for (const doc of uploadedDocs) {
      await deleteObject(doc.url);
    }
    throw error;
  }
}; 

