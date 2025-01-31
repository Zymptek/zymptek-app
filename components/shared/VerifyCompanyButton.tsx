'use client';

import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type VerificationStatus = 'not_applied' | 'applied' | 'pending' | 'approved' | 'rejected';

interface VerifyCompanyButtonProps {
  companyId: string;
  status: VerificationStatus;
  className?: string;
}

export function VerifyCompanyButton({ companyId, status, className }: VerifyCompanyButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/verify');
  };

  // Different UI states based on verification status
  switch (status) {
    case 'approved':
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 flex items-center gap-2">
            Your company is verified
            <VerificationBadge status={status} className="ml-2" />
          </AlertDescription>
        </Alert>
      );

    case 'pending':
    case 'applied':
      return (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Clock className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 flex items-center gap-2">
            Verification in progress
            <VerificationBadge status={status} className="ml-2" />
          </AlertDescription>
        </Alert>
      );

    case 'rejected':
      return (
        <Alert className="bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 flex items-center gap-2">
            Verification rejected. Please update your documents and try again.
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              className="ml-2 border-red-200 text-red-700 hover:bg-red-100"
            >
              Update Documents
            </Button>
          </AlertDescription>
        </Alert>
      );

    case 'not_applied':
      return (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className={className}
          >
            Verify Me
          </Button>
          <span className="text-sm text-muted-foreground">
            Get verified to build trust with buyers
          </span>
        </div>
      );

    default:
      return null;
  }
} 
