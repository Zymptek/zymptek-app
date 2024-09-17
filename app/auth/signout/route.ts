import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { Database } from '@/lib/database.types'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  await supabase.auth.signOut()
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')) {
      cookieStore.delete(cookie.name)
    }
  })
  
  return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 })
}