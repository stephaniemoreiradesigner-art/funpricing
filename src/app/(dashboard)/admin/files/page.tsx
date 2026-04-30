import { FolderUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FilesClient } from './FilesClient'

export interface TemplateFile {
  name: string
  size: number
  url: string
  updatedAt: string
}

async function getTemplate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  prefix: string
): Promise<TemplateFile | null> {
  const { data } = await supabase.storage.from('templates').list('', { search: prefix })
  const file = data?.find((f) => f.name.startsWith(prefix) && f.name !== '.emptyFolderPlaceholder')
  if (!file) return null
  const { data: urlData } = supabase.storage.from('templates').getPublicUrl(file.name)
  return {
    name: file.name,
    size: file.metadata?.size ?? 0,
    url: urlData.publicUrl,
    updatedAt: file.updated_at ?? file.created_at ?? '',
  }
}

export default async function FilesPage() {
  const supabase = await createClient()
  const [contract, proposal] = await Promise.all([
    getTemplate(supabase, 'contract'),
    getTemplate(supabase, 'proposal'),
  ])

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <FolderUp size={20} className="text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Arquivos</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Faça upload dos modelos de contrato e proposta. Os arquivos serão preenchidos
            automaticamente com os dados do orçamento e do cliente.
          </p>
        </div>
      </div>

      <FilesClient initialContract={contract} initialProposal={proposal} />

      {/* Guia de variáveis */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
        <p className="text-sm font-semibold text-blue-900">Variáveis disponíveis nos modelos</p>
        <p className="text-xs text-blue-700">
          Use as variáveis abaixo no seu documento Word (.docx). Elas serão substituídas
          automaticamente ao gerar o documento final.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VARIABLES.map((v) => (
            <div key={v.tag} className="bg-white border border-blue-200 rounded-lg px-3 py-2">
              <p className="text-xs font-mono font-semibold text-blue-700">{v.tag}</p>
              <p className="text-xs text-gray-500 mt-0.5">{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const VARIABLES = [
  { tag: '{{cliente_nome}}',       label: 'Razão social do cliente' },
  { tag: '{{cliente_fantasia}}',   label: 'Nome fantasia' },
  { tag: '{{cliente_cnpj}}',       label: 'CNPJ do cliente' },
  { tag: '{{cliente_email}}',      label: 'E-mail do cliente' },
  { tag: '{{cliente_telefone}}',   label: 'Telefone do cliente' },
  { tag: '{{cliente_endereco}}',   label: 'Endereço do cliente' },
  { tag: '{{orcamento_titulo}}',   label: 'Título do orçamento' },
  { tag: '{{orcamento_valor}}',    label: 'Valor total' },
  { tag: '{{orcamento_data}}',     label: 'Data do orçamento' },
  { tag: '{{validade}}',           label: 'Validade da proposta' },
  { tag: '{{empresa_nome}}',       label: 'Nome da sua empresa' },
  { tag: '{{responsavel_nome}}',   label: 'Nome do responsável' },
]
