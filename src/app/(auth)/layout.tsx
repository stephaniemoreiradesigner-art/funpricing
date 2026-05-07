import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export async function generateMetadata(): Promise<Metadata> {
  const admin = createAdminClient()
  const { data } = await admin.from('customization').select('company_name').maybeSingle()
  return { title: data?.company_name || 'FanPricing' }
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const admin = createAdminClient()
  const { data: customization } = await admin
    .from('customization')
    .select('brand_color')
    .maybeSingle()

  const brandColor = customization?.brand_color ?? '#307ca8'

  return (
    <>
      <style>{`:root { --brand: ${brandColor}; --brand-dark: ${brandColor}; }`}</style>
      {children}
    </>
  )
}
