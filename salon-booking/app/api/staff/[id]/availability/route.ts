import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUser } from '@/lib/auth'

// GET /api/staff/[id]/availability - Get availability for a staff member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const availability = await prisma.availability.findMany({
      where: { staffId: id },
      orderBy: { dayOfWeek: 'asc' },
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

// PUT /api/staff/[id]/availability - Update availability for a staff member (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { availability } = body

    if (!Array.isArray(availability)) {
      return NextResponse.json(
        { error: 'Invalid availability data' },
        { status: 400 }
      )
    }

    // Delete existing availability
    await prisma.availability.deleteMany({
      where: { staffId: id },
    })

    // Create new availability records
    const newAvailability = await prisma.availability.createMany({
      data: availability.map((a: { dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }) => ({
        staffId: id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        isActive: a.isActive ?? true,
      })),
    })

    return NextResponse.json({ success: true, count: newAvailability.count })
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}
