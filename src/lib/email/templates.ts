function baseLayout(content: string, opts: { brandColor: string; companyName: string }) {
  const { brandColor, companyName } = opts
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${companyName}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:${brandColor};padding:28px 40px;text-align:center;">
              <span style="display:inline-block;width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);line-height:44px;font-size:20px;font-weight:700;color:#fff;">
                ${companyName.charAt(0).toUpperCase()}
              </span>
              <p style="margin:12px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${companyName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Este e-mail foi enviado por ${companyName}. Não responda a esta mensagem.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function confirmationEmailTemplate(opts: {
  fullName: string
  confirmationUrl: string
  brandColor: string
  companyName: string
}) {
  const { fullName, confirmationUrl, brandColor, companyName } = opts
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Bem-vindo, ${fullName}!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
      Seu cadastro foi recebido em <strong>${companyName}</strong>. Para ativar o seu acesso,
      clique no botão abaixo para confirmar seu e-mail.
    </p>
    <p style="margin:0 0 32px;font-size:14px;color:#6b7280;line-height:1.6;">
      Após a confirmação, um administrador irá liberar o seu acesso ao sistema.
    </p>
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${confirmationUrl}"
         style="display:inline-block;padding:14px 32px;background:${brandColor};color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;">
        Confirmar e-mail
      </a>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
      O link expira em 24 horas. Se você não criou esta conta, ignore este e-mail.
    </p>`
  return baseLayout(content, { brandColor, companyName })
}

export function passwordResetEmailTemplate(opts: {
  fullName: string
  resetUrl: string
  brandColor: string
  companyName: string
}) {
  const { fullName, resetUrl, brandColor, companyName } = opts
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Redefinir senha</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
      Olá${fullName ? `, ${fullName}` : ''}! Recebemos uma solicitação para redefinir a senha
      da sua conta em <strong>${companyName}</strong>.
    </p>
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${resetUrl}"
         style="display:inline-block;padding:14px 32px;background:${brandColor};color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;">
        Redefinir minha senha
      </a>
    </div>
    <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;text-align:center;">
      O link expira em 1 hora.
    </p>
    <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
      Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.
    </p>`
  return baseLayout(content, { brandColor, companyName })
}
