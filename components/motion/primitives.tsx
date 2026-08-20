'use client'

import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { motionEase } from '@/components/motion/provider'

export function PageEnter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <m.div
      className={cn('min-h-0 min-w-0', className)}
      initial={{ opacity: 1, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: motionEase }}
    >
      {children}
    </m.div>
  )
}

export function Stagger({
  children,
  className,
  delay = 0.05,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: delay, delayChildren: 0.04 },
        },
      }}
    >
      {children}
    </m.div>
  )
}

export function FadeSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay, ease: motionEase }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 1, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.36, ease: motionEase },
        },
      }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
      whileHover={hover ? { y: -4 } : undefined}
      whileTap={hover ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </m.div>
  )
}

export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <m.div
      className={className}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
    >
      {children}
    </m.div>
  )
}

export function Pressable({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <m.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={className}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
    >
      {children}
    </m.button>
  )
}
