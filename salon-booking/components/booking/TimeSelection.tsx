'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface TimeSelectionProps {
  staffId: string
  date: string
  onSelect: (time: string) => void
  onBack: () => void
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function TimeSelection({ staffId, date, onSelect, onBack }: TimeSelectionProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailability()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, date])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/availability?staffId=${staffId}&date=${date}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch availability')
      
      const data = await response.json()
      setSlots(data.slots || [])
    } catch (error) {
      console.error('Error fetching availability:', error)
      toast.error('Greška pri učitavanju dostupnosti')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedTime) {
      onSelect(selectedTime)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Izaberite Vreme</h2>
      <p className="text-gray-600 mb-6">
        Datum: <strong>{format(new Date(date), 'dd.MM.yyyy.')}</strong>
      </p>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 text-gray-500 mb-6">
          Nema dostupnih termina za izabrani datum
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
          {slots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? 'default' : 'outline'}
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className="h-12"
            >
              {slot.time}
            </Button>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Nazad
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedTime}
          className="flex-1"
        >
          Nastavi
        </Button>
      </div>
    </div>
  )
}
