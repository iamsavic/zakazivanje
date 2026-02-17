'use client'

import { useState } from 'react'
import { Staff } from '@prisma/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface AddAppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  staff: Staff[]
  onSuccess: () => void
}

export default function AddAppointmentDialog({
  isOpen,
  onClose,
  staff,
  onSuccess,
}: AddAppointmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    staffId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    date: '',
    startTime: '',
    duration: '30', // minutes
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calculate start and end times
      const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000)

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: formData.staffId,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone || null,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          notes: formData.notes || null,
          sendConfirmation: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create appointment')
      }

      toast.success('Termin uspešno kreiran')
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        staffId: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        date: '',
        startTime: '',
        duration: '30',
        notes: '',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Došlo je do greške'
      console.error('Error creating appointment:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj Termin</DialogTitle>
          <DialogDescription>
            Ručno kreirajte novi termin za klijenta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffId">Frizer *</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) => setFormData({ ...formData, staffId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Izaberite frizera" />
              </SelectTrigger>
              <SelectContent>
                {staff.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Ime klijenta *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Telefon</Label>
            <Input
              id="clientPhone"
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              disabled={loading}
              placeholder="+381..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Vreme *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Trajanje (minuti) *</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minuta</SelectItem>
                <SelectItem value="30">30 minuta</SelectItem>
                <SelectItem value="45">45 minuta</SelectItem>
                <SelectItem value="60">60 minuta</SelectItem>
                <SelectItem value="90">90 minuta</SelectItem>
                <SelectItem value="120">120 minuta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Napomena</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={loading}
              placeholder="Opciona napomena..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Otkaži
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Kreiranje...' : 'Kreiraj Termin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
