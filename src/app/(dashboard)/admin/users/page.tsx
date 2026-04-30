import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { UsersClient } from './UsersClient'
import type { UserRole } from '@/types'

export default async function UsersPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const [
    { data: { users: authUsers } },
    { data: profiles },
  ] = await Promise.all([
    admin.auth.admin.listUsers(),
    supabase.from('profiles').select('id, full_name, role'),
  ])

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p])
  )

  const users = authUsers.map((u) => {
    const profile = profileMap.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      name: (profile as { full_name?: string } | undefined)?.full_name ?? '',
      role: (profile?.role ?? 'user') as UserRole,
      created_at: u.created_at,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie os usuários e seus perfis de acesso.
        </p>
      </div>

      <UsersClient users={users} currentUserId={currentUser!.id} />
    </div>
  )
}
