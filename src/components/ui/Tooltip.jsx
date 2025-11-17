import { useState } from 'react'

export default function Tooltip({ content, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}
      {isOpen ? (
        <span className="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-xs text-white shadow-lg">
          {content}
        </span>
      ) : null}
    </span>
  )
}
