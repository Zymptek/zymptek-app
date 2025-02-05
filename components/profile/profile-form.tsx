"use client";

import { EditDialog } from "@/components/shared/EditDialog";
import { ProfileSchema, ProfileFormValues, getCountryFromPhone } from "@/lib/schema/profile/profile-form-schema";
import { profileFormFields } from "@/lib/schema/profile/form-fields";
import { Profile } from "@/lib/types/profile";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { useEffect } from 'react';

interface ProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  profile: Profile;
  categoryOptions?: Array<{
    label: string;
    value: string;
    options?: Array<{
      label: string;
      value: string;
    }>;
  }>;
}

export function ProfileForm({
  open,
  onOpenChange,
  onSubmit,
  profile,
  categoryOptions = [],
}: ProfileFormProps) {
  const supabase = createClientComponentClient<Database>();

  // Update profile fields with dynamic category options
  const updatedFields = profileFormFields.map(field => {
    if (field.name === "business_category") {
      return {
        ...field,
        options: categoryOptions,
      };
    }
    return field;
  });

  // Handle form submission with phone number validation
  const handleSubmit = async (data: ProfileFormValues) => {
    // Get country from phone number
    const country = getCountryFromPhone(data.phone_number);
    
    // If country is detected, update the data
    if (country) {
      try {
        // First update the profile data
        await onSubmit(data);
        
        // Then update the country if it has changed
        if (country !== profile.country) {
          const { error } = await supabase
            .from('profiles')
            .update({ country })
            .eq('id', profile.id);

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    } else {
      // If no country detected, just update the profile
      await onSubmit(data);
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profile"
      description="Update your personal information"
      fields={updatedFields}
      schema={ProfileSchema}
      onSubmit={handleSubmit}
      initialData={{
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone_number: profile.phone_number,
        business_category: profile.business_category,
        designation: profile.designation
      }}
    />
  );
} 