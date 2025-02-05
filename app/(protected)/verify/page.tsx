"use client";

import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, CheckCircle2, AlertCircle, Clock, Upload, ArrowLeft, Eye, Loader2, FileText, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DOCUMENT_CONFIG, validateFile } from "@/lib/config/documents";
import { handleDocumentStorage, updateCompanyDocument, fetchCompanyDocuments, handleSubmitAllDocuments } from "@/lib/utils/document-handler";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type VerificationStatus = 'not_applied' | 'applied' | 'pending' | 'approved' | 'rejected';

interface CompanyDocument {
  id: string;
  company_id: string;
  document_type: string;
  document_url: string;
  uploaded_at: string;
  verified_at: string | null;
  verification_status: VerificationStatus | null;
}

interface TempDocument {
  file: File;
  previewUrl: string;
  documentType: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function VerifyPage() {
  const { profile } = useAuth();
  const { company, companyId, verificationStatus, isLoading } = useCompany();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [tempDocuments, setTempDocuments] = useState<TempDocument[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [verificationRecord, setVerificationRecord] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  // Load verification record
  useEffect(() => {
    const loadVerificationRecord = async () => {
      if (!companyId) return;

      const { data, error } = await supabase
        .from('seller_verification_records')
        .select('*')
        .eq('company_id', companyId)
        .eq('verification_type', 'business')
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setVerificationRecord(data);
      }
    };

    loadVerificationRecord();
  }, [companyId]);

  // Helper functions to check verification status
  const isVerified = (status: string) => status === 'approved';
  const isPending = (status: string) => status === 'pending';
  const isRejected = (status: string) => status === 'rejected';
  const isNotVerified = (status: string) => status === 'not_applied' || status === 'applied';

  // Helper function to check if verification is in progress
  const isVerificationInProgress = () => {
    return verificationRecord && 
           (verificationRecord.status === 'applied' || verificationRecord.status === 'pending');
  };

  // Load existing documents and temp documents
  useEffect(() => {
    const loadDocuments = async () => {
      if (!companyId) return;

      // Load existing documents from database
      const result = await fetchCompanyDocuments(companyId);
      if (result.success) {
        setDocuments(result.documents as CompanyDocument[]);
      }

      // Load temp documents from localStorage
      const savedTempDocs = localStorage.getItem(`tempDocs_${companyId}`);
      if (savedTempDocs) {
        try {
          const parsedDocs = JSON.parse(savedTempDocs);
          // Reconstruct File objects and preview URLs
          const reconstructedDocs = await Promise.all(
            parsedDocs.map(async (doc: any) => {
              const response = await fetch(doc.previewUrl);
              const blob = await response.blob();
              const file = new File([blob], doc.fileName, { type: doc.fileType });
              return {
                file,
                previewUrl: doc.previewUrl,
                documentType: doc.documentType
              };
            })
          );
          setTempDocuments(reconstructedDocs);
        } catch (error) {
          console.error('Error loading temp documents:', error);
          localStorage.removeItem(`tempDocs_${companyId}`);
        }
      }
    };

    loadDocuments();
  }, [companyId]);

  // Save temp documents to localStorage when they change
  useEffect(() => {
    if (companyId && tempDocuments.length > 0) {
      const docsToSave = tempDocuments.map(doc => ({
        previewUrl: doc.previewUrl,
        documentType: doc.documentType,
        fileName: doc.file.name,
        fileType: doc.file.type
      }));
      localStorage.setItem(`tempDocs_${companyId}`, JSON.stringify(docsToSave));
    }
  }, [tempDocuments, companyId]);

  const handleFileSelect = (documentType: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !companyId) {
      console.error('Missing required data:', { file: !!file, profile: !!profile, companyId: !!companyId });
      return;
    }

    // Find config by type
    const config = DOCUMENT_CONFIG.find(doc => doc.type === documentType);
    if (!config) {
      console.error('Invalid document type:', documentType);
      toast({
        title: "Error",
        description: "Invalid document type",
        variant: "destructive"
      });
      return;
    }

    try {
      // Log for debugging
      console.log('Processing document:', {
        documentType,
        configType: config.type,
        fileName: file.name,
        fileType: file.type
      });

      // Validate file
      const validationError = validateFile(file, config);
      if (validationError !== null) {
        throw new Error(validationError);
      }

      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);

      // Update temp documents using the correct type from config
      setTempDocuments(prev => {
        const filtered = prev.filter(doc => doc.documentType !== config.type);
        return [...filtered, { file, previewUrl, documentType: config.type }];
      });

      toast({
        title: "Document Ready",
        description: "Document added to queue. Click Submit when ready to upload all documents.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error handling document:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive"
      });
    }
  };

  const hasRequiredDocument = (type: string) => {
    return (
      tempDocuments.some(doc => doc.documentType === type) ||
      documents.some(doc => doc.document_type === type && doc.document_url)
    );
  };

  const handleSubmitDocuments = async () => {
    if (!profile || !companyId) return;

    try {
      setUploading(true);

      // Check if all required documents are present
      const requiredTypes = DOCUMENT_CONFIG.filter(doc => doc.required).map(doc => doc.type);
      const missingRequired = requiredTypes.filter(type => !hasRequiredDocument(type));

      if (missingRequired.length > 0) {
        const missingDocs = missingRequired.map(type => 
          DOCUMENT_CONFIG.find(doc => doc.type === type)?.name
        ).join(', ');
        throw new Error(`Missing required documents: ${missingDocs}`);
      }

      // If we have no new documents to upload, just update the status
      if (tempDocuments.length === 0) {
        // Update document statuses
        const { error: docsError } = await supabase
          .from('company_documents')
          .update({ verification_status: 'applied' })
          .eq('company_id', companyId);

        if (docsError) throw docsError;

        // Update company status
        const { error: companyError } = await supabase
          .from('companies')
          .update({
            verification_status: 'applied',
            updated_at: new Date().toISOString()
          })
          .eq('id', companyId);

        if (companyError) throw companyError;

        // Create verification record
        const { error: verificationError } = await supabase
          .from('seller_verification_records')
          .insert({
            company_id: companyId,
            verification_type: 'business',
            status: 'applied',
            submitted_at: new Date().toISOString(),
            notes: `Documents submitted: ${documents.map(d => d.document_type).join(', ')}`
          });

        if (verificationError) throw verificationError;

        toast({
          title: "Success",
          description: "Documents submitted for verification",
          variant: "success"
        });

        router.refresh();
        return;
      }

      // Handle new document uploads
      const documentsToSubmit = tempDocuments.map(doc => {
        const config = DOCUMENT_CONFIG.find(c => c.type === doc.documentType);
        if (!config) {
          throw new Error(`Invalid document type: ${doc.documentType}`);
        }
        return {
          file: doc.file,
          documentType: doc.documentType,
          config
        };
      });

      // Submit all documents with progress tracking
      await handleSubmitAllDocuments(
        companyId,
        documentsToSubmit,
        (progress) => {
          toast({
            title: "Uploading Documents",
            description: `Progress: ${Math.round(progress)}%`,
            variant: "default"
          });
        }
      );

      // Clear temp documents
      setTempDocuments([]);
      localStorage.removeItem(`tempDocs_${companyId}`);

      // Refresh documents list
      const refreshResult = await fetchCompanyDocuments(companyId);
      if (refreshResult.success) {
        setDocuments(refreshResult.documents as CompanyDocument[]);
      }

      toast({
        title: "Success",
        description: "All documents uploaded successfully and sent for verification",
        variant: "success"
      });

      router.refresh();
    } catch (error) {
      console.error('Error submitting documents:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit documents",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeTempDocument = (documentType: string) => {
    setTempDocuments(prev => {
      const doc = prev.find(d => d.documentType === documentType);
      if (doc) {
        URL.revokeObjectURL(doc.previewUrl);
      }
      return prev.filter(d => d.documentType !== documentType);
    });
  };

  const getTempDocumentByType = (type: string) => {
    return tempDocuments.find(doc => doc.documentType === type);
  };

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.document_type === type);
  };

  const handlePreview = (url: string) => {
    try {
      setPreviewUrl(url);
      setPreviewError(false);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewError(true);
      toast({
        title: "Preview Error",
        description: "Unable to preview document. You can still submit it for verification.",
        variant: "destructive"
      });
    }
  };

  // Update the submit button render logic
  const renderSubmitButton = () => {
    if (isVerified(verificationStatus)) {
      return (
        <div className="mt-8 text-center">
          <p className="text-green-600 font-medium mb-2">Your company is verified ✓</p>
          <p className="text-sm text-muted-foreground">
            You can update your documents if needed
          </p>
        </div>
      );
    }

    if (isVerificationInProgress()) {
      return (
        <div className="mt-8 text-center">
          <p className="text-yellow-600 font-medium mb-2">
            <Clock className="h-4 w-4 inline-block mr-2" />
            Verification in Progress
          </p>
          <p className="text-sm text-muted-foreground">
            Your documents are being reviewed. We'll notify you once the verification is complete.
            {verificationRecord?.submitted_at && (
              <span className="block mt-1">
                Submitted on: {new Date(verificationRecord.submitted_at).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
      );
    }

    if (isRejected(verificationStatus)) {
      return (
        <Button
          className="bg-[#8f1e00] hover:bg-[#dd6236] text-white px-6 transition-colors"
          disabled={uploading}
          onClick={handleSubmitDocuments}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Resubmit Documents
            </>
          )}
        </Button>
      );
    }

    return (
      <Button
        className="bg-[#8f1e00] hover:bg-[#dd6236] text-white px-6 transition-colors"
        disabled={uploading || isVerificationInProgress()}
        onClick={handleSubmitDocuments}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : tempDocuments.length > 0 ? (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Submit Documents
          </>
        ) : documents.length > 0 ? (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Submit for Verification
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Submit
          </>
        )}
      </Button>
    );
  };

  // Update the file input disabled state
  const isFileUploadDisabled = () => {
    return uploading || 
           isVerified(verificationStatus) || 
           isVerificationInProgress();
  };

  if (!profile || !company) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-brand-200"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Company Verification</h1>
            <p className="text-muted-foreground">Complete verification to build trust with buyers</p>
          </div>
        </motion.div>

        {/* Verification Status */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {isVerified(verificationStatus) ? (
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                ) : isPending(verificationStatus) ? (
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                ) : isRejected(verificationStatus) ? (
                  <div className="p-3 rounded-full bg-red-100">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-brand-100">
                    <AlertCircle className="h-8 w-8 text-brand-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold">
                    {isVerified(verificationStatus) ? 'Verified Company' :
                     isPending(verificationStatus) ? 'Verification in Progress' :
                     isRejected(verificationStatus) ? 'Verification Rejected' :
                     verificationStatus === 'applied' ? 'Documents Submitted' :
                     'Not Applied'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isVerified(verificationStatus) ? 'Your company is verified and trusted by buyers' :
                     isPending(verificationStatus) ? 'We are reviewing your verification documents' :
                     isRejected(verificationStatus) ? 'Your verification was rejected. Please update your documents and try again.' :
                     verificationStatus === 'applied' ? 'Your documents have been submitted and are pending review' :
                     'Upload required documents to get verified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Required Documents */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload the following documents to complete verification</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {DOCUMENT_CONFIG.map((doc) => {
                  const tempDoc = getTempDocumentByType(doc.type);
                  const existingDoc = getDocumentByType(doc.type);
                  
                  return (
                    <div key={doc.type} className="p-6 rounded-lg bg-brand-100/5 border border-brand-100/20">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{doc.name}</h3>
                            {doc.required && (
                              <span className="text-xs text-red-500">*Required</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                          {tempDoc && (
                            <div className="flex items-center gap-2 mt-2">
                              <FileText className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-yellow-500">
                                Ready to upload: {tempDoc.file.name}
                              </span>
                            </div>
                          )}
                          {!tempDoc && existingDoc && (
                            <div className="flex items-center gap-2 mt-2">
                              <FileText className="h-4 w-4 text-brand-200" />
                              <span className="text-sm text-brand-200">
                                Uploaded on {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {tempDoc && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-brand-200"
                                onClick={() => handlePreview(tempDoc.previewUrl)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => removeTempDocument(doc.type)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {!tempDoc && existingDoc && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-brand-200"
                              onClick={() => handlePreview(existingDoc.document_url)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          )}
                          <div className="relative">
                            <input
                              type="file"
                              accept={doc.acceptedTypes?.join(',')}
                              onChange={handleFileSelect(doc.type)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              disabled={isFileUploadDisabled()}
                            />
                            <Button 
                              variant="outline"
                              className="text-brand-200 border-brand-200"
                              disabled={isFileUploadDisabled()}
                            >
                              {uploading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {tempDoc ? 'Change' : existingDoc ? 'Update' : 'Upload'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {isVerificationInProgress() && existingDoc && (
                        <div className="mt-2 text-sm text-yellow-600">
                          <Clock className="h-4 w-4 inline-block mr-1" />
                          Under review
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button Section */}
              <div className="mt-8 flex flex-col items-center justify-center">
                {renderSubmitButton()}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Verification Process */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
            <CardHeader>
              <CardTitle>Verification Process</CardTitle>
              <CardDescription>What happens after you submit documents</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-sm text-brand-600">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Document Review</p>
                    <p className="text-sm text-muted-foreground">Our team reviews your submitted documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-sm text-brand-600">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Verification Check</p>
                    <p className="text-sm text-muted-foreground">We verify your company details and credentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-sm text-brand-600">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Approval</p>
                    <p className="text-sm text-muted-foreground">Your company gets verified status upon approval</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-full max-w-[95vw] h-[95vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-[calc(95vh-80px)] p-6">
            {previewUrl && !previewError ? (
              <object
                data={previewUrl}
                type="application/pdf"
                className="w-full h-full"
                onError={() => {
                  setPreviewError(true);
                  toast({
                    title: "Preview Error",
                    description: "Unable to preview document. You can still submit it for verification.",
                    variant: "destructive"
                  });
                }}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                  <p className="text-lg font-medium">Unable to Preview Document</p>
                  <p className="text-sm text-muted-foreground text-center">
                    The document cannot be previewed at this time.<br />
                    You can still submit it for verification.
                  </p>
                </div>
              </object>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-lg font-medium">Unable to Preview Document</p>
                <p className="text-sm text-muted-foreground text-center">
                  The document cannot be previewed at this time.<br />
                  You can still submit it for verification.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 


