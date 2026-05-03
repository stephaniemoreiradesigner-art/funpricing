import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SidebarProvider } from '@/components/layout/SidebarProvider'
import type { UserRole } from '@/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, customizationResult] = await Promise.all([
    supabase.from('profiles').select('full_name, role, avatar_url').eq('id', user.id).single(),
    supabase.from('customization').select('brand_color, logo_url').maybeSingle(),
  ])

  const profile = profileResult.data
  const customization = customizationResult.data

  const role = (profile?.role ?? 'user') as UserRole
  const name = profile?.full_name ?? user.email ?? 'Usuário'
  const avatarUrl = (profile as { avatar_url?: string | null } | null)?.avatar_url ?? null
  const brandColor = customization?.brand_color ?? '#307ca8'
  const logoUrl = customization?.logo_url ?? null

  // Calcula cor escura para hover (reduz luminosidade ~15%)
  const brandDark = brandColor

  return (
    <SidebarProvider>
      {/* Injeta CSS variable com a cor da marca salva no banco */}
      {brandColor !== '#307ca8' && (
        <style>{`:root { --brand: ${brandColor}; --brand-dark: ${brandDark}; }`}</style>
      )}
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
