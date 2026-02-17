import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addMinutes, format, isAfter, isBefore } from 'date-fns'

// GET /api/availability?staffId=X&date=Y - Get available time slots
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const staffId = searchParams.get('staffId')
    const dateStr = searchParams.get('date')

    if (!staffId || !dateStr) {
      return NextResponse.json(
        { error: 'staffId and date are required' },
        { status: 400 }
      )
    }

    const date = new Date(dateStr)
    const dayOfWeek = date.getDay()

    // Get staff availability for this day
    const availability = await prisma.availability.findFirst({
      where: {
        staffId,
        dayOfWeek,
        isActive: true,
      },
    })

    if (!availability) {
      return NextResponse.json({ slots: [] })
    }

    // Get existing appointments for this day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const appointments = await prisma.appointment.findMany({
      where: {
        staffId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    // Get blocked slots for this day
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        staffId,
        startTime: {
          lte: endOfDay,
        },
        endTime: {
          gte: startOfDay,
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    // Generate time slots (30-minute intervals)
    const slots: { time: string; available: boolean }[] = []
    const slotDuration = 30 // minutes

    const [startHour, startMinute] = availability.startTime.split(':').map(Number)
    const [endHour, endMinute] = availability.endTime.split(':').map(Number)

    const startTime = new Date(date)
    startTime.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date(date)
    endTime.setHours(endHour, endMinute, 0, 0)

    let currentTime = startTime
    const now = new Date()

    while (isBefore(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, slotDuration)
      const timeStr = format(currentTime, 'HH:mm')

      // Check if slot is in the past
      const isPast = isBefore(currentTime, now)

      // Check if slot conflicts with existing appointments
      const hasAppointment = appointments.some(apt => {
        const aptStart = new Date(apt.startTime)
        const aptEnd = new Date(apt.endTime)
        return (
          (isAfter(currentTime, aptStart) || currentTime.getTime() === aptStart.getTime()) &&
          isBefore(currentTime, aptEnd)
        ) || (
          isAfter(slotEnd, aptStart) &&
          (isBefore(slotEnd, aptEnd) || slotEnd.getTime() === aptEnd.getTime())
        )
      })

      // Check if slot conflicts with blocked slots
      const isBlocked = blockedSlots.some(blocked => {
        const blockStart = new Date(blocked.startTime)
        const blockEnd = new Date(blocked.endTime)
        return (
          (isAfter(currentTime, blockStart) || currentTime.getTime() === blockStart.getTime()) &&
          isBefore(currentTime, blockEnd)
        ) || (
          isAfter(slotEnd, blockStart) &&
          (isBefore(slotEnd, blockEnd) || slotEnd.getTime() === blockEnd.getTime())
        )
      })

      const available = !isPast && !hasAppointment && !isBlocked

      slots.push({
        time: timeStr,
        available,
      })

      currentTime = slotEnd
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
