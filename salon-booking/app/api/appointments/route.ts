import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import AppointmentConfirmation from '@/emails/appointment-confirmation'

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const staffId = searchParams.get('staffId')
    const status = searchParams.get('status')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where: Record<string, unknown> = {}

    if (staffId) {
      where.staffId = staffId
    }

    if (status) {
      where.status = status
    }

    if (from || to) {
      where.startTime = {}
      if (from) where.startTime.gte = new Date(from)
      if (to) where.startTime.lte = new Date(to)
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        staff: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      staffId,
      clientName,
      clientEmail,
      clientPhone,
      startTime,
      endTime,
      notes,
      sendConfirmation = true,
    } = body

    // Validation
    if (!staffId || !clientName || !clientEmail || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if staff exists and is active
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
    })

    if (!staff || !staff.active) {
      return NextResponse.json(
        { error: 'Staff member not found or inactive' },
        { status: 400 }
      )
    }

    // Check for conflicts
    const conflicts = await prisma.appointment.count({
      where: {
        staffId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    })

    if (conflicts > 0) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        staffId,
        clientName,
        clientEmail,
        clientPhone,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        status: 'PENDING',
      },
      include: {
        staff: true,
      },
    })

    // Send confirmation email
    if (sendConfirmation) {
      try {
        await sendEmail({
          to: clientEmail,
          subject: 'Potvrda termina',
          react: AppointmentConfirmation({
            clientName,
            staffName: staff.name,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            appointmentId: appointment.id,
          }),
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the appointment creation if email fails
      }
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
