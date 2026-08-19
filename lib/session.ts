'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { permissionMatrix, staff } from '@/lib/mock-data'

const STORAGE_KEY = 'airests-session'

export type StaffSession = {
  id: string
  name: string
  initials: string
  role: string
}

export type SurfaceId = 'pos' | 'kds' | 'admin' | 'order'

export const surfaces: {
  id: SurfaceId
  label: string
  href: string
  permission: string
}[] = [
  { id: 'pos', label: 'Windows POS', href: '/pos', permission: 'Access POS Register' },
  { id: 'kds', label: 'Kitchen Display', href: '/kds', permission: 'Access Kitchen Display' },
  { id: 'admin', label: 'Admin Portal', href: '/admin', permission: 'Admin Access' },
  { id: 'order', label: 'Customer Ordering', href: '/order', permission: 'Preview Guest Ordering' },
]

export function roleHasPermission(role: string, permission: string) {
  const row = permissionMatrix.find((entry) => entry.permission === permission)
  if (!row) return false
  return Boolean((row as Record<string, boolean | string>)[role])
}

export function surfacesForRole(role: string) {
  return surfaces.filter((surface) => roleHasPermission(role, surface.permission))
}

export function canSeeAppOverview(role: string) {
  return roleHasPermission(role, 'Admin Access')
}

export function surfaceFromPath(pathname: string): SurfaceId | null {
  if (pathname.startsWith('/pos')) return 'pos'
  if (pathname.startsWith('/kds')) return 'kds'
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/order')) return 'order'
  return null
}

function personToSession(person: (typeof staff)[number]): StaffSession {
  return { id: person.id, name: person.name, initials: person.initials, role: person.role }
}

export function writeSession(person: (typeof staff)[number]) {
  const session = personToSession(person)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('airests-session'))
  return session
}

export function readSession(): StaffSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StaffSession
    if (!parsed?.id || !parsed.role) return null
    return parsed
  } catch {
    return null
  }
}

function inferSession(pathname: string): StaffSession | null {
  if (pathname.startsWith('/order') || pathname === '/') return null
  const fallbackId = pathname.startsWith('/admin')
    ? 'st-8'
    : pathname.startsWith('/kds')
      ? 'st-4'
      : 'st-1'
  const person = staff.find((entry) => entry.id === fallbackId) ?? staff[0]
  return personToSession(person)
}

export function useSession() {
  const pathname = usePathname()
  const [session, setSession] = React.useState<StaffSession | null>(null)

  React.useEffect(() => {
    function sync() {
      setSession(readSession() ?? inferSession(pathname))
    }
    sync()
    window.addEventListener('airests-session', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('airests-session', sync)
      window.removeEventListener('storage', sync)
    }
  }, [pathname])

  return session
}
