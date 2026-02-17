import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUser } from '@/lib/auth'

// GET /api/staff/[id]/blocked-slots - Get blocked slots for a staff member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: { staffId: id },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(blockedSlots)
  } catch (error) {
    console.error('Error fetching blocked slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blocked slots' },
      { status: 500 }
    )
  }
}

// POST /api/staff/[id]/blocked-slots - Create blocked slot (admin only)
export async function POST(
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
    const { startTime, endTime, reason } = body

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Start time and end time are required' },
        { status: 400 }
      )
    }

    const blockedSlot = await prisma.blockedSlot.create({
      data: {
        staffId: id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reason,
      },
    })

    return NextResponse.json(blockedSlot, { status: 201 })
  } catch (error) {
    console.error('Error creating blocked slot:', error)
    return NextResponse.json(
      { error: 'Failed to create blocked slot' },
      { status: 500 }
    )
  }
}

// DELETE /api/staff/[staffId]/blocked-slots/[slotId] is handled in a separate file
