# Supabase Client Migration Guide

## Overview
We are standardizing our Supabase client usage to use Next.js auth helpers consistently. This guide explains how to migrate your code.

## Current Status
The codebase currently uses multiple approaches to interact with Supabase:
1. Direct imports from `@supabase/auth-helpers-nextjs`
2. Custom Supabase instances
3. Mix of client and server components

## Migration Plan

### Phase 1: Dual Support (Current)
- Both old and new approaches work
- New code should use new methods
- Existing code can be migrated gradually

### Phase 2: Gradual Migration
Migrate files based on their type:

1. Client Components:
```typescript
// Before
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createClientComponentClient()

// After
import { createClient } from '@/lib/supabase-client'
const supabase = createClient()
```

2. Server Components:
```typescript
// Before
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createServerComponentClient({ cookies })

// After
import { createServerClient } from '@/lib/supabase-client'
const supabase = createServerClient()
```

3. Server Actions:
```typescript
// Before
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createServerComponentClient({ cookies })

// After
import { createActionClient } from '@/lib/supabase-client'
const supabase = await createActionClient()
```

### Phase 3: Cleanup (Future)
- Remove legacy support
- Update all components to use new methods
- Remove old imports

## Best Practices
1. Use the appropriate client for your context:
   - `createClient()` for client components
   - `createServerClient()` for server components
   - `createActionClient()` for server actions

2. Type Safety:
   - All clients are typed with our database schema
   - Use the generated types for better type safety

3. Authentication:
   - Auth state is automatically handled
   - Cookies are managed correctly in all contexts

## Files to Update
Key files that need migration:
- `app/page.tsx`
- `lib/utils/document-handler.ts`
- `lib/schema/activitySchema.ts`
- `lib/product/productSubmission.tsx`
- `lib/api/orders.ts`
- `hooks/useProductEditor.ts`

## Testing
After updating each file:
1. Test authentication flows
2. Verify data fetching works
3. Check error handling
4. Ensure types are correct 