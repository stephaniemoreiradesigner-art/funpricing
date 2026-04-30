import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import type { UserRole } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  const role = (profile?.role ?? 'user') as UserRole
  const name = profile?.full_name ?? user.email ?? 'Usuário'
  const avatarUrl = (profile as { avatar_url?: string | null } | null)?.avatar_url ?? null

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} userName={name} avatarUrl={avatarUrl} />
      <div className="ml-60 flex flex-col min-h-screen">
        <Header title="FanPricing" userName={name} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
