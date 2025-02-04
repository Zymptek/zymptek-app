'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { validateFile, DocumentConfig } from '@/lib/config/documents';
import { deleteObject, uploadObject } from '@/lib/storage';

export interface DocumentUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filePath?: string;
}

export interface Company {
  id: string;
  [key: string]: any;
}

const supabase = createClientComponentClient<Database>();

export const handleDocumentStorage = async (
  file: File,
  config: DocumentConfig,
  bucketName: string,
  filePath: string
): Promise<DocumentUploadResult> => {
  try {
    // Validate the file
    const validationError = validateFile(file, config);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      filePath
    };

  } catch (error) {
    console.error('Error handling document storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const handleDocumentDeletion = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error handling document deletion:', error);
    return false;
  }
};

export const updateCompanyDocument = async (
  company: Company,
  doc: {
    file: File;
    documentType: string;
    config: DocumentConfig;
  }
): Promise<DocumentUploadResult> => {
  try {
    // Upload new document
    const uploadResult = await handleDocumentStorage(
      doc.file,
      doc.config,
      'company-images',
      `${company.id}/company/details/${doc.documentType}-${Math.random()}.${doc.file.name.split('.').pop()}`
    );

    if (!uploadResult.success) {
      return uploadResult;
    }

    // Update company record with new document URL
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        [`${doc.documentType}_url`]: uploadResult.url,
        updated_at: new Date().toISOString()
      })
      .eq('id', company.id);

    if (updateError) {
      console.error('Error updating company record:', updateError);
      return {
        success: false,
        error: updateError.message
      };
    }

    return uploadResult;
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
        doc.config,
        'company-images',
        `${company.id}/company/details/${doc.documentType}-${Math.random()}.${doc.file.name.split('.').pop()}`
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

