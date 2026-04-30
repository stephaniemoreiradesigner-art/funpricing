'use client'

import { useRef, useState } from 'react'
import { Upload, FileDown } from 'lucide-react'
import { importClientsCSV } from '@/app/actions/clients'

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const sep = lines[0].includes(';') ? ';' : ','
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase())
  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values = line.split(sep).map((v) => v.trim().replace(/^["']|["']$/g, ''))
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
    })
}

function orNull(v: string | undefined): string | null {
  return v && v.trim() ? v.trim() : null
}

function downloadTemplate() {
  const rows = [
    'razao_social,nome_fantasia,cnpj,responsible,phone,email,address,city,state,zip',
    '"Empresa Alpha Ltda","Alpha","12.345.678/0001-99","João Silva","(11) 91234-5678","joao@alpha.com","Rua das Flores, 100","São Paulo","SP","01310-000"',
    '"Beta Serviços SA","Beta","98.765.432/0001-11","Maria Souza","(21) 99876-5432","maria@beta.com","Av. Brasil, 200","Rio de Janeiro","RJ","20040-020"',
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modelo-clientes.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function ClientsImport() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  async function handleCSVChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const parsed = parseCSV(text)

    const valid = parsed
      .map((r) => ({
        razao_social: r.razao_social || r['razão_social'] || r.empresa || '',
        nome_fantasia: orNull(r.nome_fantasia || r.fantasia),
        cnpj: orNull(r.cnpj),
        ie: orNull(r.ie),
        im: orNull(r.im),
        responsible: orNull(r.responsible || r.responsavel || r.responsável),
        phone: orNull(r.phone || r.telefone),
        email: orNull(r.email),
        address: orNull(r.address || r.endereco || r.endereço),
        city: orNull(r.city || r.cidade),
        state: orNull(r.state || r.estado || r.uf),
        zip: orNull(r.zip || r.cep),
      }))
      .filter((r) => r.razao_social)

    if (valid.length === 0) {
      alert('Nenhum registro válido encontrado. Certifique-se que a coluna "razao_social" está preenchida.')
      e.target.value = ''
      return
    }

    if (!confirm(`Importar ${valid.length} cliente(s)?`)) {
      e.target.value = ''
      return
    }

    setImporting(true)
    await importClientsCSV(valid)
    setImporting(false)
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={downloadTemplate}
        className="flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        title="Baixar modelo CSV"
      >
        <FileDown size={15} />
        Modelo CSV
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={importing}
        className="flex items-center gap-1.5 border border-[#307ca8] text-[#307ca8] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#307ca8]/5 transition-colors disabled:opacity-50"
      >
        <Upload size={15} />
        {importing ? 'Importando...' : 'Importar CSV'}
      </button>
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVChange} />
    </div>
  )
}
