import { z } from "zod";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export const ActivitySchema = z.object({
  user_id: z.string(),
  activity_type: z.enum([
    'PROFILE_UPDATE',
    'PRODUCT_CREATE',
    'PRODUCT_UPDATE',
    'COMPANY_UPDATE',
    'AVATAR_UPDATE',
    'COMPANY_LOGO_UPDATE'
  ]),
  entity_id: z.string().optional(),
  entity_type: z.enum(['PROFILE', 'PRODUCT', 'COMPANY']).optional(),
  description: z.string(),
  metadata: z.record(z.any()).optional()
});

export type Activity = z.infer<typeof ActivitySchema>;

export async function recordActivity(activity: Omit<Activity, 'id' | 'created_at'>) {
  const supabase = createClientComponentClient<Database>();
  
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([activity])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording activity:', error);
    throw error;
  }
}

export async function getRecentActivities(userId: string, limit: number = 10) {
  const supabase = createClientComponentClient<Database>();
  
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
} 