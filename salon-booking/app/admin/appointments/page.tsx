import { prisma } from '@/lib/db'
import AppointmentsList from '@/components/admin/AppointmentsList'

export default async function AppointmentsPage() {
  const [appointments, staff] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        staff: true,
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 100, // Limit to last 100 appointments
    }),
    prisma.staff.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Termini</h1>
        <p className="text-gray-500 mt-1">Upravljajte svim terminima</p>
      </div>

      <AppointmentsList initialAppointments={appointments} staff={staff} />
    </div>
  )
}
