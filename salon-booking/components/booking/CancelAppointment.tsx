'use client'

import { useState } from 'react'
import { Appointment, Staff } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

type AppointmentWithStaff = Appointment & {
  staff: Staff
}

interface CancelAppointmentProps {
  appointment: AppointmentWithStaff
  isPast: boolean
}

export default function CancelAppointment({ appointment, isPast }: CancelAppointmentProps) {
  const [loading, setLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Da li ste sigurni da želite da otkažete ovaj termin?')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel appointment')
      }

      setCancelled(true)
      toast.success('Termin uspešno otkazan')
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Greška pri otkazivanju termina')
    } finally {
      setLoading(false)
    }
  }

  if (cancelled) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Termin Otkazan
          </h1>
          <p className="text-gray-600 mb-6">
            Vaš termin je uspešno otkazan. Dobićete email potvrdu.
          </p>
          <Link href="/">
            <Button>Nazad na Početnu</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (isPast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Termin u Prošlosti</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Ovaj termin je već prošao i ne može biti otkazan.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Otkaži Termin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Detalji termina:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Frizer:</strong> {appointment.staff.name}
              </div>
              <div>
                <strong>Datum:</strong> {format(new Date(appointment.startTime), 'dd.MM.yyyy.')}
              </div>
              <div>
                <strong>Vreme:</strong>{' '}
                {format(new Date(appointment.startTime), 'HH:mm')} -{' '}
                {format(new Date(appointment.endTime), 'HH:mm')}
              </div>
              <div>
                <strong>Klijent:</strong> {appointment.clientName}
              </div>
              {appointment.notes && (
                <div>
                  <strong>Napomena:</strong> {appointment.notes}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Da li ste sigurni da želite da otkažete ovaj termin? Dobićete email potvrdu.
          </p>

          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Nazad
              </Button>
            </Link>
            <Button
              onClick={handleCancel}
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              {loading ? 'Otkazivanje...' : 'Otkaži Termin'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
