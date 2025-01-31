'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';

type VerificationStatus = Database['public']['Enums']['verification_status_enum'];

interface CompanyDocument {
  document_type: string;
  document_url: string;
}

interface Company {
  id: string;
  name: string;
  verification_status: VerificationStatus;
  verification_date: string | null;
  company_documents: CompanyDocument[];
}

interface DatabaseCompany {
  id: string;
  name: string;
  verification_status: VerificationStatus | null;
  verification_date: string | null;
  company_documents: CompanyDocument[];
}

export default function VerificationReviewPage({ params }: { params: { companyId: string } }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('companies')
          .select(`
            id,
            name,
            verification_status,
            verification_date,
            company_documents (
              document_type,
              document_url
            )
          `)
          .eq('id', params.companyId)
          .single();

        if (error) throw error;

        // Convert database type to component type
        if (data) {
          const companyData: Company = {
            ...data,
            verification_status: data.verification_status || 'not_applied'
          };
          setCompany(companyData);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load company details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [params.companyId]);

  const handleVerificationAction = async (action: 'approve' | 'reject') => {
    if (!company) return;

    try {
      setActionLoading(true);

      const newStatus: VerificationStatus = action === 'approve' ? 'approved' : 'not_applied';

      // Update company verification status
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          verification_status: newStatus,
          verification_date: new Date().toISOString(),
        })
        .eq('id', company.id);

      if (updateError) throw updateError;

      // Record verification action
      const { error: recordError } = await supabase
        .from('seller_verification_records')
        .insert({
          id: crypto.randomUUID(),
          company_id: company.id,
          verification_type: 'business',
          status: newStatus,
          notes: action === 'reject' ? rejectionNotes : null,
          submitted_at: new Date().toISOString(),
          verified_at: new Date().toISOString(),
          verifier_id: null // Will be updated with actual admin ID
        });

      if (recordError) throw recordError;

      toast({
        title: 'Success',
        description: `Company verification ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      });

      router.push('/admin/verifications');
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: 'Error',
        description: `Failed to ${action} verification`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Review Verification Request</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {company.name}
            </p>
          </div>
          <VerificationBadge status={company.verification_status} />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Submitted Documents</h3>
            <div className="grid gap-4">
              {company.company_documents.map((doc, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {doc.document_type.replace(/_/g, ' ')}
                      </h4>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Rejection Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter reason for rejection (required for rejecting)"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => handleVerificationAction('reject')}
                disabled={actionLoading || !rejectionNotes}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                onClick={() => handleVerificationAction('approve')}
                disabled={actionLoading}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
