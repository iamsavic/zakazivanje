'use client'

import { useState } from 'react'
import { Appointment, Staff } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import AddAppointmentDialog from './AddAppointmentDialog'

type AppointmentWithStaff = Appointment & {
  staff: Staff
}

interface AppointmentsListProps {
  initialAppointments: AppointmentWithStaff[]
  staff: Staff[]
}

export default function AppointmentsList({ initialAppointments, staff }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [filterStaff, setFilterStaff] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const filteredAppointments = appointments.filter(apt => {
    if (filterStaff !== 'all' && apt.staffId !== filterStaff) return false
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false
    return true
  })

  const handleUpdateStatus = async (id: string, status: string) => {
    setLoading(id)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update')

      const updated = await response.json()
      setAppointments(prev =>
        prev.map(apt => (apt.id === id ? updated : apt))
      )
      toast.success('Status ažuriran')
    } catch {
      toast.error('Greška pri ažuriranju')
    } finally {
      setLoading(null)
    }
  }

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da otkažete ovaj termin?')) return

    setLoading(id)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to cancel')

      setAppointments(prev =>
        prev.map(apt =>
          apt.id === id ? { ...apt, status: 'CANCELLED' as const } : apt
        )
      )
      toast.success('Termin otkazan')
    } catch {
      toast.error('Greška pri otkazivanju')
    } finally {
      setLoading(null)
    }
  }

  const handleAppointmentAdded = async () => {
    // Refresh appointments
    const response = await fetch('/api/appointments')
    const data = await response.json()
    setAppointments(data)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'outline',
      CONFIRMED: 'default',
      CANCELLED: 'destructive',
      COMPLETED: 'secondary',
    }

    const labels: Record<string, string> = {
      PENDING: 'Na čekanju',
      CONFIRMED: 'Potvrđen',
      CANCELLED: 'Otkazan',
      COMPLETED: 'Završen',
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Select value={filterStaff} onValueChange={setFilterStaff}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Svi frizeri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Svi frizeri</SelectItem>
            {staff.map(s => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Svi statusi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Svi statusi</SelectItem>
            <SelectItem value="PENDING">Na čekanju</SelectItem>
            <SelectItem value="CONFIRMED">Potvrđen</SelectItem>
            <SelectItem value="CANCELLED">Otkazan</SelectItem>
            <SelectItem value="COMPLETED">Završen</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj Termin
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Klijent</TableHead>
                  <TableHead>Frizer</TableHead>
                  <TableHead>Datum i Vreme</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map(apt => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{apt.clientName}</div>
                        <div className="text-sm text-gray-500">{apt.clientEmail}</div>
                        {apt.clientPhone && (
                          <div className="text-sm text-gray-500">{apt.clientPhone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{apt.staff.name}</TableCell>
                    <TableCell>
                      <div>
                        <div>{format(new Date(apt.startTime), 'dd.MM.yyyy.')}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(apt.startTime), 'HH:mm')} -{' '}
                          {format(new Date(apt.endTime), 'HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(apt.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {apt.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            disabled={loading === apt.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Potvrdi
                          </Button>
                        )}
                        {apt.status !== 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelAppointment(apt.id)}
                            disabled={loading === apt.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Otkaži
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              Nema termina koji odgovaraju filterima
            </div>
          )}
        </CardContent>
      </Card>

      <AddAppointmentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        staff={staff}
        onSuccess={handleAppointmentAdded}
      />
    </div>
  )
}
