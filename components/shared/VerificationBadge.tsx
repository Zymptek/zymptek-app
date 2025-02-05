'use client';

import { Badge } from "@/components/ui/badge";
import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

type VerificationStatus = 'not_applied' | 'applied' | 'pending' | 'approved' | 'rejected';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const variants = {
    'not_applied': {
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: AlertCircle,
      label: 'Not Verified'
    },
    'applied': {
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: Clock,
      label: 'Verification Applied'
    },
    'pending': {
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: Clock,
      label: 'Verification Pending'
    },
    'approved': {
      className: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircle2,
      label: 'Verified'
    },
    'rejected': {
      className: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle,
      label: 'Verification Rejected'
    }
  };

  const { className: variantClassName, icon: Icon, label } = variants[status];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1 py-1 px-2",
        variantClassName,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
} 
