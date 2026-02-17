import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create staff members
  const staff1 = await prisma.staff.create({
    data: {
      name: 'Marko Petrović',
      email: 'marko@salon.rs',
      phone: '+381601234567',
      active: true,
    },
  })

  const staff2 = await prisma.staff.create({
    data: {
      name: 'Ana Jovanović',
      email: 'ana@salon.rs',
      phone: '+381601234568',
      active: true,
    },
  })

  console.log('✅ Created staff members')

  // Create availability for staff1 (Monday-Friday, 9:00-17:00)
  const weekdayAvailability = [1, 2, 3, 4, 5] // Mon-Fri
  for (const day of weekdayAvailability) {
    await prisma.availability.create({
      data: {
        staffId: staff1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
    })
  }

  // Saturday hours (9:00-14:00)
  await prisma.availability.create({
    data: {
      staffId: staff1.id,
      dayOfWeek: 6,
      startTime: '09:00',
      endTime: '14:00',
      isActive: true,
    },
  })

  // Create availability for staff2 (Tuesday-Saturday, 10:00-18:00)
  const staff2Days = [2, 3, 4, 5, 6] // Tue-Sat
  for (const day of staff2Days) {
    await prisma.availability.create({
      data: {
        staffId: staff2.id,
        dayOfWeek: day,
        startTime: '10:00',
        endTime: '18:00',
        isActive: true,
      },
    })
  }

  console.log('✅ Created availability schedules')

  // Create a sample appointment
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const appointmentEnd = new Date(tomorrow)
  appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30)

  await prisma.appointment.create({
    data: {
      staffId: staff1.id,
      clientName: 'Petar Nikolić',
      clientEmail: 'petar@example.com',
      clientPhone: '+381601234569',
      startTime: tomorrow,
      endTime: appointmentEnd,
      status: 'CONFIRMED',
      notes: 'Šišanje i brijanje',
    },
  })

  console.log('✅ Created sample appointment')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
