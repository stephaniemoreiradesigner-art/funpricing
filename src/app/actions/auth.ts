'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/lib/email/mailer'
import { confirmationEmailTemplate, passwordResetEmailTemplate } from '@/lib/email/templates'

async function getCustomizationForEmail() {
  const admin = createAdminClient()
  const { data } = await admin.from('customization').select('brand_color, company_name').maybeSingle()
  return {
    brandColor: data?.brand_color ?? '#307ca8',
    companyName: data?.company_name ?? 'FanPricing',
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string
): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: { redirectTo: `${appUrl}/auth/callback?next=/login` },
  })

  if (linkError) {
    if (linkError.message.includes('already registered') || linkError.message.includes('already exists')) {
      return { error: 'Este e-mail já está cadastrado. Faça login.' }
    }
    return { error: 'Erro ao criar conta. Tente novamente.' }
  }

  const userId = linkData.user.id
  const confirmationUrl = linkData.properties?.action_link ?? ''

  await admin.from('profiles').upsert(
    { id: userId, email, full_name: fullName, role: 'user' },
    { onConflict: 'id' }
  )

  try {
    const { brandColor, companyName } = await getCustomizationForEmail()
    await sendEmail({
      to: email,
      subject: `Confirme seu cadastro — ${companyName}`,
      html: confirmationEmailTemplate({ fullName, confirmationUrl, brandColor, companyName }),
    })
  } catch {
    // E-mail opcional: cadastro criado mesmo sem SMTP configurado
  }

  return {}
}

export async function sendPasswordReset(email: string): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { data: userData } = await admin
    .from('profiles')
    .select('full_name')
    .eq('email', email)
    .maybeSingle()

  const fullName = userData?.full_name ?? ''

  const { data: linkData, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${appUrl}/auth/callback?next=/reset-password` },
  })

  if (error) {
    // Não revelamos se o e-mail existe ou não por segurança
    return {}
  }

  const resetUrl = linkData?.properties?.action_link ?? ''

  try {
    const { brandColor, companyName } = await getCustomizationForEmail()
    await sendEmail({
      to: email,
      subject: `Redefinir senha — ${companyName}`,
      html: passwordResetEmailTemplate({ fullName, resetUrl, brandColor, companyName }),
    })
  } catch {
    return { error: 'Erro ao enviar e-mail. Verifique as configurações de SMTP.' }
  }

  return {}
}

export async function createProfileAfterSignup(userId: string, email: string, fullName: string) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return
    const admin = createAdminClient()
    await admin.from('profiles').upsert(
      { id: userId, email, full_name: fullName, role: 'user' },
      { onConflict: 'id' }
    )
  } catch {
    // perfil será criado no primeiro login pelo layout
  }
}
