import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import CancelAppointment from '@/components/booking/CancelAppointment'

interface CancelPageProps {
  params: Promise<{ id: string }>
}

export default async function CancelPage({ params }: CancelPageProps) {
  const { id } = await params

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      staff: true,
    },
  })

  if (!appointment) {
    notFound()
  }

  // Check if already cancelled
  if (appointment.status === 'CANCELLED') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="text-3xl">ℹ️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Termin Već Otkazan
            </h1>
            <p className="text-gray-600">
              Ovaj termin je već otkazan.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Check if appointment is in the past
  const isPast = new Date(appointment.startTime) < new Date()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <CancelAppointment appointment={appointment} isPast={isPast} />
      </div>
    </div>
  )
}
