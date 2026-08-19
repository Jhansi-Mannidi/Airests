'use client'

import { PageEnter } from '@/components/motion/primitives'

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnter className="flex h-dvh min-h-0 flex-col">{children}</PageEnter>
}
