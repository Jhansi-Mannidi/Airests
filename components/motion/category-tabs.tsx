'use client'

import { m, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'

export function CategoryTabs({
  items,
  value,
  onChange,
  layoutId,
}: {
  items: string[]
  value: string
  onChange: (value: string) => void
  layoutId: string
}) {
  return (
    <LayoutGroup id={layoutId}>
      <div className="flex gap-1 overflow-x-auto">
        {items.map((item) => {
          const active = item === value
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={cn(
                'relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                active ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {active && (
                <m.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
