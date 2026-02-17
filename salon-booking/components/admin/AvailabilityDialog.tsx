'use client'

import { useState, useEffect } from 'react'
import { Staff, Availability } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface AvailabilityDialogProps {
  isOpen: boolean
  onClose: () => void
  staff: (Staff & { availability: Availability[] }) | null
  onSuccess: () => void
}

interface DayAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

const DAYS = [
  { value: 0, label: 'Nedelja' },
  { value: 1, label: 'Ponedeljak' },
  { value: 2, label: 'Utorak' },
  { value: 3, label: 'Sreda' },
  { value: 4, label: 'Četvrtak' },
  { value: 5, label: 'Petak' },
  { value: 6, label: 'Subota' },
]

export default function AvailabilityDialog({ isOpen, onClose, staff, onSuccess }: AvailabilityDialogProps) {
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState<DayAvailability[]>([])

  useEffect(() => {
    if (staff && isOpen) {
      // Initialize with existing availability or default values
      const existingAvailability = DAYS.map(day => {
        const existing = staff.availability.find(a => a.dayOfWeek === day.value)
        return {
          dayOfWeek: day.value,
          startTime: existing?.startTime || '09:00',
          endTime: existing?.endTime || '17:00',
          isActive: existing?.isActive || false,
        }
      })
      setAvailability(existingAvailability)
    }
  }, [staff, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staff) return

    setLoading(true)

    try {
      const activeAvailability = availability.filter(a => a.isActive)

      const response = await fetch(`/api/staff/${staff.id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availability: activeAvailability,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save availability')
      }

      toast.success('Radno vreme uspešno ažurirano')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving availability:', error)
      toast.error('Došlo je do greške pri čuvanju')
    } finally {
      setLoading(false)
    }
  }

  const updateDay = (dayOfWeek: number, field: keyof DayAvailability, value: string | boolean) => {
    setAvailability(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, [field]: value }
          : day
      )
    )
  }

  if (!staff) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Radno Vreme - {staff.name}</DialogTitle>
          <DialogDescription>
            Podesite radno vreme za svakog dan u nedelji
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {DAYS.map((day) => {
              const dayData = availability.find(a => a.dayOfWeek === day.value)
              if (!dayData) return null

              return (
                <div key={day.value} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 min-w-[120px]">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={dayData.isActive}
                      onCheckedChange={(checked) =>
                        updateDay(day.value, 'isActive', checked)
                      }
                    />
                    <Label
                      htmlFor={`day-${day.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day.label}
                    </Label>
                  </div>

                  {dayData.isActive && (
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1">
                        <Input
                          type="time"
                          value={dayData.startTime}
                          onChange={(e) =>
                            updateDay(day.value, 'startTime', e.target.value)
                          }
                          disabled={loading}
                        />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="flex-1">
                        <Input
                          type="time"
                          value={dayData.endTime}
                          onChange={(e) =>
                            updateDay(day.value, 'endTime', e.target.value)
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Otkaži
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Čuvanje...' : 'Sačuvaj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
