import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/lib/database.types';
import { Edit2, User, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const formSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone_number: z.string().transform(value => {
    const numericValue = value.replace(/\D/g, '');
    return parseInt(numericValue, 10);
  }).refine(value => !isNaN(value) && value > 0, {
    message: 'Phone number must be a valid number',
  }),
  company_name: z.string().optional(),
});


type Profile = Tables<'profiles'>;

type CompanyProfile = {
  company_name: string;
};

type FormData = z.infer<typeof formSchema>;

const ProfileCard: React.FC<{ profile: Profile }> = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone_number: parseInt(profile.phone_number),
      company_name: (profile.company_profile as CompanyProfile)?.company_name || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          company_profile: {
            company_name: data.company_name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Profile Information
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {profile.user_type === 'SELLER' && (
                    <FormField
                      control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  )}
                  <Button type="submit" disabled={isLoading} className='w-full btn-primary'>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>

                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span>{profile.first_name} {profile.last_name}</span>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span>{profile.phone_number}</span>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span>{profile.country}</span>
          </div>
          {(profile.company_profile as CompanyProfile)?.company_name && (
            <div className="flex items-center">

              <Briefcase className="h-5 w-5 mr-2" />
              <span>{(profile.company_profile as CompanyProfile).company_name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;