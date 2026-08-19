'use client'

import { PageEnter } from '@/components/motion/primitives'

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnter className="flex min-h-dvh flex-col">{children}</PageEnter>
}
