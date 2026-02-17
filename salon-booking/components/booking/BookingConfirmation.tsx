'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { format, addMinutes } from 'date-fns'
import Link from 'next/link'
import { BookingData } from './BookingFlow'

interface BookingConfirmationProps {
  bookingData: BookingData
  onReset: () => void
}

export default function BookingConfirmation({ bookingData, onReset }: BookingConfirmationProps) {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createAppointment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createAppointment = async () => {
    setLoading(true)
    setError(null)

    try {
      // Combine date and time to create DateTime
      const [hours, minutes] = bookingData.time.split(':')
      const startDateTime = new Date(bookingData.date)
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      // Default 30-minute appointment
      const endDateTime = addMinutes(startDateTime, 30)

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staffId: bookingData.staffId,
          clientName: bookingData.clientName,
          clientEmail: bookingData.clientEmail,
          clientPhone: bookingData.clientPhone || null,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          notes: bookingData.notes || null,
          sendConfirmation: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create appointment')
      }

      setSuccess(true)
      toast.success('Termin uspešno zakazan!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Došlo je do greške pri zakazivanju'
      console.error('Error creating appointment:', err)
      setError(errorMessage)
      toast.error('Greška pri zakazivanju termina')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Zakazivanje...</h2>
        <p className="text-gray-600">Molimo sačekajte dok kreiramo vaš termin</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Greška</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={onReset}>Pokušaj Ponovo</Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Termin Potvrđen! ✅</h2>
        <p className="text-gray-600 mb-6">
          Poslali smo vam email sa detaljima termina i linkom za otkazivanje.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-3">Detalji termina:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <strong>Frizer:</strong> {bookingData.staffName}
            </div>
            <div>
              <strong>Datum:</strong> {format(new Date(bookingData.date), 'dd.MM.yyyy.')}
            </div>
            <div>
              <strong>Vreme:</strong> {bookingData.time}
            </div>
            <div>
              <strong>Klijent:</strong> {bookingData.clientName}
            </div>
            {bookingData.notes && (
              <div>
                <strong>Napomena:</strong> {bookingData.notes}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Nazad na Početnu</Button>
          </Link>
          <Button onClick={onReset}>Zakaži Još Jedan Termin</Button>
        </div>
      </div>
    )
  }

  return null
}
