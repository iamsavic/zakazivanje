'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ClientInfoProps {
  onSubmit: (data: {
    clientName: string
    clientEmail: string
    clientPhone: string
    notes: string
  }) => void
  onBack: () => void
}

export default function ClientInfo({ onSubmit, onBack }: ClientInfoProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Vaši Podaci</h2>
      <p className="text-gray-600 mb-6">
        Unesite svoje podatke da bismo vam poslali potvrdu
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Ime i prezime *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
            placeholder="Petar Petrović"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) =>
              setFormData({ ...formData, clientEmail: e.target.value })
            }
            required
            placeholder="petar@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Telefon</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={formData.clientPhone}
            onChange={(e) =>
              setFormData({ ...formData, clientPhone: e.target.value })
            }
            placeholder="+381601234567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Napomena (opciono)</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Npr. šišanje i brijanje"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Nazad
          </Button>
          <Button type="submit" className="flex-1">
            Potvrdi Termin
          </Button>
        </div>
      </form>
    </div>
  )
}
