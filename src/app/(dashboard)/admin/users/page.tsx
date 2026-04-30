import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { UsersClient } from './UsersClient'
import type { UserRole } from '@/types'

export default async function UsersPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Tenta buscar colunas estendidas; se não existirem, cai no fallback básico
  let profiles: Array<Record<string, unknown>> = []
  const { data: extended, error: extError } = await supabase
    .from('profiles')
    .select('id, full_name, role, phone, cnpj, address, avatar_url')

  if (extError) {
    const { data: basic } = await supabase
      .from('profiles')
      .select('id, full_name, role')
    profiles = basic ?? []
  } else {
    profiles = extended ?? []
  }

  // Busca usuários auth com tratamento de erro
  let authUsers: Awaited<ReturnType<typeof admin.auth.admin.listUsers>>['data']['users'] = []
  try {
    const { data } = await admin.auth.admin.listUsers()
    authUsers = data.users
  } catch {
    // SUPABASE_SERVICE_ROLE_KEY pode não estar configurada em produção
  }

  const profileMap = new Map(profiles.map((p) => [p.id as string, p]))

  const users = authUsers.map((u) => {
    const p = profileMap.get(u.id) ?? {}
    return {
      id: u.id,
      email: u.email ?? '',
      name: (p.full_name as string) ?? '',
      role: ((p.role as string) ?? 'user') as UserRole,
      phone: (p.phone as string) ?? '',
      cnpj: (p.cnpj as string) ?? '',
      address: (p.address as string) ?? '',
      avatar_url: (p.avatar_url as string | null) ?? null,
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
