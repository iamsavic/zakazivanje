import { prisma } from '@/lib/db'
import StaffList from '@/components/admin/StaffList'

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    include: {
      availability: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Frizeri</h1>
        <p className="text-gray-500 mt-1">Upravljajte frizerima i njihovim radnim vremenom</p>
      </div>

      <StaffList initialStaff={staff} />
    </div>
  )
}
