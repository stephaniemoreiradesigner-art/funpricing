import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SidebarProvider } from '@/components/layout/SidebarProvider'
import type { UserRole } from '@/types'

const getCustomization = cache(async () => {
  const admin = createAdminClient()
  const { data } = await admin.from('customization').select('brand_color, logo_url, company_name').maybeSingle()
  return data
})

export async function generateMetadata(): Promise<Metadata> {
  const customization = await getCustomization()
  const title = customization?.company_name || 'FanPricing'
  return { title }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, customization] = await Promise.all([
    supabase.from('profiles').select('full_name, role, avatar_url').eq('id', user.id).single(),
    getCustomization(),
  ])

  const profile = profileResult.data

  const role = (profile?.role ?? 'user') as UserRole
  const name = profile?.full_name ?? user.email ?? 'Usuário'
  const avatarUrl = (profile as { avatar_url?: string | null } | null)?.avatar_url ?? null
  const brandColor = customization?.brand_color ?? '#307ca8'
  const logoUrl = customization?.logo_url ?? null

  return (
    <SidebarProvider>
      <style>{`:root { --brand: ${brandColor}; --brand-dark: color-mix(in srgb, ${brandColor} 82%, black); }`}</style>
      <div className="min-h-screen bg-gray-50">
        <Sidebar role={role} userName={name} avatarUrl={avatarUrl} logoUrl={logoUrl} />
        <div className="md:ml-60 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
