'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { adminNavItems } from '@/lib/admin-nav'
import { brand, customers, menuItems, registers, staff } from '@/lib/mock-data'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Hit = { href: string; label: string; hint: string; group: string }

function buildHits(): Hit[] {
  return [
    ...adminNavItems.map((item) => ({
      href: item.href,
      label: item.label,
      hint: 'Page',
      group: 'Pages',
    })),
    ...staff.map((person) => ({
      href: '/admin/staff',
      label: person.name,
      hint: `${person.role} · ${person.location}`,
      group: 'Staff',
    })),
    ...brand.locations.map((loc) => ({
      href: '/admin/locations',
      label: loc.name,
      hint: loc.city,
      group: 'Locations',
    })),
    ...menuItems.map((item) => ({
      href: `/admin/menu?item=${item.id}`,
      label: item.name,
      hint: `${item.category} · $${item.price.toFixed(2)}`,
      group: 'Menu',
    })),
    ...customers.map((customer) => ({
      href: '/admin/customers',
      label: customer.name,
      hint: customer.email,
      group: 'Customers',
    })),
    ...registers.map((register) => ({
      href: '/admin/devices',
      label: register.name,
      hint: `${register.location} · ${register.bound ? 'Paired' : 'Unbound'}`,
      group: 'Devices',
    })),
  ]
}

export function AdminSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hits = buildHits()
    if (!q) return hits.filter((hit) => hit.group === 'Pages')
    return hits
      .filter((hit) => `${hit.label} ${hit.hint} ${hit.group}`.toLowerCase().includes(q))
      .slice(0, 24)
  }, [query])

  useEffect(() => {
    setActive(0)
  }, [query, open])

  const groups = useMemo(() => {
    const order = ['Pages', 'Staff', 'Locations', 'Menu', 'Customers', 'Devices']
    return order
      .map((group) => ({ group, hits: matches.filter((hit) => hit.group === group) }))
      .filter((entry) => entry.hits.length > 0)
  }, [matches])

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
      <PopoverTrigger aria-label="Search admin" className="icon-btn inline-flex">
        <Search className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-2 sm:w-[26rem]" sideOffset={8}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive((index) => Math.min(index + 1, matches.length - 1))
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive((index) => Math.max(index - 1, 0))
            }
            if (event.key === 'Enter' && matches[active]) {
              event.preventDefault()
              window.location.assign(matches[active].href)
              setOpen(false)
            }
          }}
          placeholder="Search pages, staff, menu, customers…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">Ctrl/Cmd + K · ↑↓ Enter</p>
        <div className="mt-2 max-h-80 overflow-y-auto">
          {matches.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">Nothing matches “{query}”.</p>
          ) : (
            groups.map((entry) => (
              <div key={entry.group} className="mb-1.5">
                <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {entry.group}
                </p>
                {entry.hits.map((hit) => {
                  const index = matches.findIndex((item) => item === hit || (item.href === hit.href && item.label === hit.label && item.group === hit.group))
                  return (
                    <Link
                      key={`${hit.group}-${hit.href}-${hit.label}`}
                      href={hit.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-sm ${
                        index === active ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{hit.label}</span>
                        <span className="block truncate text-xs opacity-70">{hit.hint}</span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
