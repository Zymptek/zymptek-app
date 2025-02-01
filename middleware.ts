import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle orders route security
  if (req.nextUrl.pathname.startsWith('/orders/')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    const encodedOrderId = req.nextUrl.pathname.split('/')[2]
    if (!encodedOrderId) return res

    try {
      // Decode the order ID
      const orderId = Buffer.from(encodedOrderId, 'base64').toString()

      // Check order access
      const { data: order, error } = await supabase
        .from('orders')
        .select('buyer_id, seller_id')
        .eq('id', orderId)
        .single()

      if (error || !order) {
        return NextResponse.redirect(new URL('/404', req.url))
      }

      const user = session.user
      const isAdmin = user.role === 'admin'
      const isBuyer = order.buyer_id === user.id
      const isSeller = order.seller_id === user.id

      if (!isAdmin && !isBuyer && !isSeller) {
        return NextResponse.redirect(new URL('/403', req.url))
      }
    } catch (error) {
      // If decoding fails or any other error occurs
      return NextResponse.redirect(new URL('/404', req.url))
    }
  }

  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    '/orders/:path*',
    '/messages/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
}