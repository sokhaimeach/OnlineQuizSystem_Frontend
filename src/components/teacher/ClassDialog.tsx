import { useEffect, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import type { Class, CreateClassPayload } from '@/models/class.interface'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const CLASS_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
] as const

const DEFAULT_CLASS_COLOR = CLASS_COLORS[7].value

interface ClassDialogProps {
  open: boolean
  classItem?: Class | null
  isSubmitting: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateClassPayload) => void
}

export function ClassDialog({
  open,
  classItem,
  isSubmitting,
  error,
  onOpenChange,
  onSubmit,
}: ClassDialogProps) {
  const [className, setClassName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState<string>(DEFAULT_CLASS_COLOR)

  useEffect(() => {
    if (!open) return
    setClassName(classItem?.class_name ?? '')
    setDescription(classItem?.description ?? '')
    setColor(classItem?.color || DEFAULT_CLASS_COLOR)
  }, [classItem, open])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = className.trim()
    if (!trimmedName) return

    onSubmit({
      class_name: trimmedName,
      description: description.trim(),
      color,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{classItem ? 'Edit class' : 'Create class'}</DialogTitle>
          <DialogDescription>
            {classItem ? 'Update this class’s details.' : 'Create a class for your students and assignments.'}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-xs font-medium">
            Class name
            <Input
              autoFocus
              required
              maxLength={100}
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="e.g. SV23"
              disabled={isSubmitting}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-medium">
            Description
            <Textarea
              rows={3}
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this class about?"
              disabled={isSubmitting}
              className="resize-none"
            />
          </label>
          <fieldset className="grid gap-2">
            <legend className="text-xs font-medium">Color</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Class color">
              {CLASS_COLORS.map(option => {
                const isSelected = color.toLowerCase() === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={option.name}
                    title={option.name}
                    disabled={isSubmitting}
                    onClick={() => setColor(option.value)}
                    className={`flex size-7 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      isSelected ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                    }`}
                    style={{ backgroundColor: option.value }}
                  >
                    {isSelected && <Check className="size-4 text-white drop-shadow-sm" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </fieldset>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <DialogFooter className="mt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !className.trim()}>
              {isSubmitting ? 'Saving…' : classItem ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
