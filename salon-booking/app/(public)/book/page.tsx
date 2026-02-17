import { prisma } from '@/lib/db'
import BookingFlow from '@/components/booking/BookingFlow'

export default async function BookPage() {
  const staff = await prisma.staff.findMany({
    where: { active: true },
    include: {
      availability: {
        where: { isActive: true },
        orderBy: { dayOfWeek: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Zakažite Termin</h1>
          <p className="text-gray-600 mt-2">
            Pratite korake da biste zakazali svoj termin
          </p>
        </div>

        <BookingFlow staff={staff} />
      </div>
    </div>
  )
}
