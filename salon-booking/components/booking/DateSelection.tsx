'use client'

import { useState } from 'react'
import { Staff, Availability } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { addDays, startOfDay } from 'date-fns'

type StaffWithAvailability = Staff & {
  availability: Availability[]
}

interface DateSelectionProps {
  staff: StaffWithAvailability
  onSelect: (date: string) => void
  onBack: () => void
}

export default function DateSelection({ staff, onSelect, onBack }: DateSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // Get available days of week for this staff
  const availableDays = staff.availability.map(a => a.dayOfWeek)

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay()
    const today = startOfDay(new Date())
    
    // Check if date is in the past
    if (date < today) return false
    
    // Check if staff works on this day
    return availableDays.includes(dayOfWeek)
  }

  const handleContinue = () => {
    if (selectedDate) {
      onSelect(selectedDate.toISOString().split('T')[0])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Izaberite Datum</h2>
      <p className="text-gray-600 mb-6">Frizer: <strong>{staff.name}</strong></p>

      <div className="flex justify-center mb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => !isDateAvailable(date)}
          fromDate={new Date()}
          toDate={addDays(new Date(), 60)} // 60 days in advance
          className="rounded-md border"
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Nazad
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedDate}
          className="flex-1"
        >
          Nastavi
        </Button>
      </div>
    </div>
  )
}
