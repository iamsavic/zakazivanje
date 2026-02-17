import { Staff, Appointment, Availability, BlockedSlot, AppointmentStatus } from '@prisma/client'

// Re-export Prisma types
export type { Staff, Appointment, Availability, BlockedSlot, AppointmentStatus }

// Extended types
export interface StaffWithRelations extends Staff {
  appointments?: Appointment[]
  availability?: Availability[]
  blockedSlots?: BlockedSlot[]
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingFormData {
  staffId: string
  date: string
  time: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  notes?: string
}

export interface AvailabilityByDay {
  [key: number]: {
    startTime: string
    endTime: string
    isActive: boolean
  }
}
