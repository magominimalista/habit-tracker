interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium transition-all
        ${active 
          ? 'bg-gray-700 text-white rounded-full' 
          : 'text-gray-400 hover:text-white'
        }
      `}
    >
      {children}
    </button>
  )
} 