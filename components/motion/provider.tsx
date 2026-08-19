'use client'

import { LazyMotion, MotionConfig, domMax } from 'framer-motion'

const easeOut = [0.22, 1, 0.36, 1] as const

export const motionEase = easeOut

export const motionTransition = {
  duration: 0.32,
  ease: easeOut,
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={motionTransition}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
