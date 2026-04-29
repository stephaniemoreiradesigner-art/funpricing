import { createClient } from '@/lib/supabase/server'
import { CustomizationForm } from './CustomizationForm'

export default async function CustomizationPage() {
  const supabase = await createClient()
  const { data: config } = await supabase
    .from('customization')
    .select('company_name, logo_url, brand_color')
    .maybeSingle()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personalização</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure a identidade visual que aparece nas propostas enviadas aos clientes.
        </p>
      </div>

      <CustomizationForm config={config} />
    </div>
  )
}
