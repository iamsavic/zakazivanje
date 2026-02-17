'use client'

import { useState } from 'react'
import { Staff, Availability } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import StepIndicator from './StepIndicator'
import StaffSelection from './StaffSelection'
import DateSelection from './DateSelection'
import TimeSelection from './TimeSelection'
import ClientInfo from './ClientInfo'
import BookingConfirmation from './BookingConfirmation'

type StaffWithAvailability = Staff & {
  availability: Availability[]
}

interface BookingFlowProps {
  staff: StaffWithAvailability[]
}

export interface BookingData {
  staffId: string
  staffName: string
  date: string
  time: string
  clientName: string
  clientEmail: string
  clientPhone: string
  notes: string
}

export default function BookingFlow({ staff }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({})

  const steps = [
    { number: 1, label: 'Frizer' },
    { number: 2, label: 'Datum' },
    { number: 3, label: 'Vreme' },
    { number: 4, label: 'Podaci' },
    { number: 5, label: 'Potvrda' },
  ]

  const handleNext = (data: Partial<BookingData>) => {
    setBookingData({ ...bookingData, ...data })
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setBookingData({})
  }

  return (
    <div>
      <StepIndicator steps={steps} currentStep={currentStep} />

      <Card className="mt-8">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <StaffSelection
              staff={staff}
              onSelect={(staffId, staffName) => handleNext({ staffId, staffName })}
            />
          )}

          {currentStep === 2 && bookingData.staffId && (
            <DateSelection
              staffId={bookingData.staffId}
              staff={staff.find(s => s.id === bookingData.staffId)!}
              onSelect={(date) => handleNext({ date })}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && bookingData.staffId && bookingData.date && (
            <TimeSelection
              staffId={bookingData.staffId}
              date={bookingData.date}
              onSelect={(time) => handleNext({ time })}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <ClientInfo
              onSubmit={(clientData) => handleNext(clientData)}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <BookingConfirmation
              bookingData={bookingData as BookingData}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
