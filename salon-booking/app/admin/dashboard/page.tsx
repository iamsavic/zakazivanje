import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  // Fetch stats
  const [totalAppointments, totalStaff, todayAppointments, confirmedAppointments] = 
    await Promise.all([
      prisma.appointment.count(),
      prisma.staff.count({ where: { active: true } }),
      prisma.appointment.count({
        where: {
          startTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.appointment.count({
        where: {
          status: 'CONFIRMED',
        },
      }),
    ])

  const stats = [
    {
      name: 'Ukupno Termina',
      value: totalAppointments,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      name: 'Aktivni Frizeri',
      value: totalStaff,
      icon: Users,
      color: 'text-green-600',
    },
    {
      name: 'Termini Danas',
      value: todayAppointments,
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      name: 'Potvrđeni Termini',
      value: confirmedAppointments,
      icon: CheckCircle,
      color: 'text-purple-600',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Pregled statistike i aktivnosti</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Dobrodošli u Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Koristite navigaciju sa leve strane da upravljate terminima, frizerima i podešavanjima.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
