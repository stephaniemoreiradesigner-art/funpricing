import Link from 'next/link'
import { Settings, UserCog, Package, Hammer, Percent, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './ProfileForm'
import type { Profile } from '@/types'

const ADMIN_SECTIONS = [
  {
    href: '/admin/users',
    label: 'Usuários',
    description: 'Gerencie usuários e permissões',
    icon: UserCog,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    href: '/admin/products',
    label: 'Produtos',
    description: 'Cadastre e edite produtos',
    icon: Package,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/admin/labor',
    label: 'Mão de Obra',
    description: 'Funções, níveis e salários',
    icon: Hammer,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    href: '/admin/markup',
    label: 'Markup',
    description: 'Overhead, impostos e margem',
    icon: Percent,
    color: 'bg-green-50 text-green-600',
  },
  {
    href: '/admin/customization',
    label: 'Personalização',
    description: 'Logo, cores e identidade visual',
    icon: Palette,
    color: 'bg-pink-50 text-pink-600',
  },
]

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#307ca8]/10 flex items-center justify-center">
          <Settings size={20} className="text-[#307ca8]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie seu perfil e preferências.</p>
        </div>
      </div>

      {/* Hub de admin */}
      {isAdmin && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Administração
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ADMIN_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm hover:border-gray-300 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${section.color}`}>
                  <section.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{section.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Perfil do usuário */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#307ca8] flex items-center justify-center text-white font-bold text-lg">
            {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{profile?.name || '—'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className={`inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
              isAdmin ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {isAdmin ? 'Admin' : 'Usuário'}
            </span>
          </div>
        </div>

        <ProfileForm profile={(profile ?? { id: user!.id, name: '', role: 'user', avatar_url: null, phone: null, cnpj: null, address: null, created_at: '' }) as Profile} />
      </div>
    </div>
  )
}
