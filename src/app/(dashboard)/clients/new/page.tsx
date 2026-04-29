import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ClientForm } from '../ClientForm'

export default function NewClientPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/clients" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Novo cliente</h2>
          <p className="text-sm text-gray-500 mt-0.5">Preencha os dados do cliente para cadastrá-lo.</p>
        </div>
      </div>

      <ClientForm />
    </div>
  )
}
