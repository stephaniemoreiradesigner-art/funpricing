interface HeaderProps {
  title: string
  userName: string
}

export function Header({ title, userName }: HeaderProps) {
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{userName}</span>
        <div className="w-8 h-8 rounded-full bg-[#307ca8] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  )
}
