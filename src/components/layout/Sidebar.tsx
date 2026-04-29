'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Send,
  FileSignature,
  BarChart2,
  Settings,
  ShieldCheck,
  Package,
  Hammer,
  Percent,
  Palette,
  UserCog,
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import type { UserRole } from '@/types'

const navUser = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/quotes', label: 'Orçamentos', icon: FileText },
  { href: '/proposals', label: 'Propostas', icon: Send },
  { href: '/contracts', label: 'Contratos', icon: FileSignature },
  { href: '/stats', label: 'Estatísticas', icon: BarChart2 },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

const navAdmin = [
  { href: '/admin/users', label: 'Usuários', icon: UserCog },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/labor', label: 'Mão de Obra', icon: Hammer },
  { href: '/admin/markup', label: 'Markup', icon: Percent },
  { href: '/admin/customization', label: 'Personalização', icon: Palette },
]

interface SidebarProps {
  role: UserRole
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const active = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-[#307ca8] text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-[#307ca8] flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="font-bold text-gray-900">FunPricing</span>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navUser.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        {role === 'admin' && (
          <>
            <div className="pt-4 pb-1">
              <div className="flex items-center gap-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <ShieldCheck size={12} />
                Admin
              </div>
            </div>
            {navAdmin.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-200">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
