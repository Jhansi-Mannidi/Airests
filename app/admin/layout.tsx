import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-canvas flex h-dvh">
      <div className="hidden h-full md:block">
        <AdminSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  )
}
