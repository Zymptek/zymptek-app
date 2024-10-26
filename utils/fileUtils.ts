import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function getSignedUrl(filePath: string): Promise<string> {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.storage
    .from('chat-attachments')
    .createSignedUrl(filePath, 3600) // URL valid for 1 hour

  if (error) throw error;
  return data.signedUrl;
}
