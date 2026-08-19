'use client'

import { PageEnter } from '@/components/motion/primitives'

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnter className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</PageEnter>
}
