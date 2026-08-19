'use client'

import * as React from 'react'
import { AlertTriangle, ShieldAlert } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function RefundVoidDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [reason, setReason] = React.useState('')
  const [pin, setPin] = React.useState('')

  const canConfirm = reason.length > 0 && pin.length === 4

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle>Void Transaction #4468</DialogTitle>
          <DialogDescription>Table 3 · Jordan Pierce · Closed 4 min ago</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-secondary/60 p-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Original Total</span>
            <span className="font-mono tabular-nums text-foreground">$96.20</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Payment Method</span>
            <span className="text-foreground">Visa •••• 4821</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="void-reason" className="mb-2 text-sm font-medium text-foreground">
              Reason for Void <span className="text-danger">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="void-reason" className="mt-2 w-full">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complaint">Customer complaint</SelectItem>
                <SelectItem value="order-error">Order error</SelectItem>
                <SelectItem value="comp">Comp</SelectItem>
                <SelectItem value="duplicate">Duplicate charge</SelectItem>
                <SelectItem value="other">Other (see notes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="manager-pin" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <ShieldAlert className="size-3.5 text-muted-foreground" />
              Manager Authorization PIN <span className="text-danger">*</span>
            </Label>
            <Input
              id="manager-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="mt-2 font-mono tracking-widest"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          This action will be logged and cannot be undone. The customer&apos;s card will be refunded within 2–5 business days.
        </p>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!canConfirm}
            onClick={() => {
              onOpenChange(false)
              toast.success('Transaction voided', { description: 'Refund of $96.20 has been queued.' })
            }}
          >
            Confirm Void
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
