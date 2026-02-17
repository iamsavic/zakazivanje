import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import AppointmentReminder from '@/emails/appointment-reminder'

// This endpoint is protected by middleware checking the CRON_SECRET

export async function GET() {
  try {
    // Find appointments that are:
    // 1. Between 22 and 26 hours from now (targeting 24h window with buffer)
    // 2. Status is CONFIRMED or PENDING
    // 3. Reminder not yet sent

    const now = new Date()
    const twentyTwoHoursFromNow = new Date(now.getTime() + 22 * 60 * 60 * 1000)
    const twentySixHoursFromNow = new Date(now.getTime() + 26 * 60 * 60 * 1000)

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: twentyTwoHoursFromNow,
          lte: twentySixHoursFromNow,
        },
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
        reminderSent: false,
      },
      include: {
        staff: true,
      },
    })

    console.log(`Found ${appointments.length} appointments to send reminders for`)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const appointment of appointments) {
      try {
        await sendEmail({
          to: appointment.clientEmail,
          subject: 'Podsetnik: Vaš termin je sutra',
          react: AppointmentReminder({
            clientName: appointment.clientName,
            staffName: appointment.staff.name,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            appointmentId: appointment.id,
          }),
        })

        // Mark reminder as sent
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            reminderSent: true,
            reminderSentAt: new Date(),
          },
        })

        results.success++
        console.log(`Sent reminder for appointment ${appointment.id}`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error)
        results.failed++
        results.errors.push(`${appointment.id}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      message: 'Reminder sending completed',
      ...results,
      totalAppointments: appointments.length,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in send-reminders cron:', error)
    return NextResponse.json(
      {
        error: 'Failed to send reminders',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
