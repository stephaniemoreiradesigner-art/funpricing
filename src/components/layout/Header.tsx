import Image from 'next/image'

interface HeaderProps {
  userName: string
  avatarUrl?: string | null
}

export function Header({ userName, avatarUrl }: HeaderProps) {
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1)

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-4">
      <span className="text-sm text-gray-500">{todayFormatted}</span>
      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#307ca8] flex items-center justify-center shrink-0">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={userName} width={32} height={32} className="object-cover w-full h-full" />
        ) : (
          <span className="text-white text-xs font-semibold">{initials}</span>
        )}
      </div>
    </header>
  )
}
