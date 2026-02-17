'use client'

import { useState, useEffect } from 'react'
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
import { toast } from 'sonner'

interface StaffDialogProps {
  isOpen: boolean
  onClose: () => void
  staff: Staff | null
  onSuccess: () => void
}

export default function StaffDialog({ isOpen, onClose, staff, onSuccess }: StaffDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    active: true,
  })

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone || '',
        avatarUrl: staff.avatarUrl || '',
        active: staff.active,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        avatarUrl: '',
        active: true,
      })
    }
  }, [staff, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = staff ? `/api/staff/${staff.id}` : '/api/staff'
      const method = staff ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          avatarUrl: formData.avatarUrl || null,
          active: formData.active,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save staff')
      }

      toast.success(staff ? 'Frizer uspešno ažuriran' : 'Frizer uspešno dodat')
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Došlo je do greške'
      console.error('Error saving staff:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async () => {
    if (!staff) return

    setLoading(true)
    try {
      const response = await fetch(`/api/staff/${staff.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !formData.active,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setFormData(prev => ({ ...prev, active: !prev.active }))
      toast.success(formData.active ? 'Frizer deaktiviran' : 'Frizer aktiviran')
      onSuccess()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Došlo je do greške')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{staff ? 'Izmeni Frizera' : 'Dodaj Frizera'}</DialogTitle>
          <DialogDescription>
            {staff ? 'Ažurirajte informacije o frizeru' : 'Dodajte novog frizera u sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime i prezime *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
              placeholder="+381..."
            />
          </div>

          <DialogFooter className="gap-2">
            {staff && (
              <Button
                type="button"
                variant="outline"
                onClick={handleToggleActive}
                disabled={loading}
              >
                {formData.active ? 'Deaktiviraj' : 'Aktiviraj'}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Otkaži
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Čuvanje...' : staff ? 'Sačuvaj' : 'Dodaj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
