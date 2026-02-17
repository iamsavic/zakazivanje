'use client'

import { useState } from 'react'
import { Staff, Availability } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Edit, Clock, Calendar } from 'lucide-react'
import StaffDialog from './StaffDialog'
import AvailabilityDialog from './AvailabilityDialog'

type StaffWithRelations = Staff & {
  availability: Availability[]
  _count: {
    appointments: number
  }
}

interface StaffListProps {
  initialStaff: StaffWithRelations[]
}

export default function StaffList({ initialStaff }: StaffListProps) {
  const [staff, setStaff] = useState(initialStaff)
  const [selectedStaff, setSelectedStaff] = useState<StaffWithRelations | null>(null)
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false)
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false)

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsStaffDialogOpen(true)
  }

  const handleEditStaff = (staffMember: StaffWithRelations) => {
    setSelectedStaff(staffMember)
    setIsStaffDialogOpen(true)
  }

  const handleEditAvailability = (staffMember: StaffWithRelations) => {
    setSelectedStaff(staffMember)
    setIsAvailabilityDialogOpen(true)
  }

  const handleStaffUpdated = async () => {
    // Refresh staff list
    const response = await fetch('/api/staff')
    const data = await response.json()
    setStaff(data)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const daysOfWeek = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']

  return (
    <div>
      <div className="mb-6">
        <Button onClick={handleAddStaff}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj Frizera
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((staffMember) => (
          <Card key={staffMember.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(staffMember.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{staffMember.name}</CardTitle>
                    <p className="text-sm text-gray-500">{staffMember.email}</p>
                  </div>
                </div>
                <Badge variant={staffMember.active ? 'default' : 'secondary'}>
                  {staffMember.active ? 'Aktivan' : 'Neaktivan'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffMember.phone && (
                  <p className="text-sm text-gray-600">📱 {staffMember.phone}</p>
                )}
                
                <div className="text-sm text-gray-600">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {staffMember._count.appointments} termina
                </div>

                {staffMember.availability.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Radno vreme:
                    <div className="mt-1 text-xs">
                      {staffMember.availability
                        .filter(a => a.isActive)
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                        .map(a => `${daysOfWeek[a.dayOfWeek]} ${a.startTime}-${a.endTime}`)
                        .join(', ')}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditStaff(staffMember)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Izmeni
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditAvailability(staffMember)}
                    className="flex-1"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Radno vreme
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nema dodanih frizera. Kliknite na &quot;Dodaj Frizera&quot; da biste dodali prvog.</p>
          </CardContent>
        </Card>
      )}

      <StaffDialog
        isOpen={isStaffDialogOpen}
        onClose={() => setIsStaffDialogOpen(false)}
        staff={selectedStaff}
        onSuccess={handleStaffUpdated}
      />

      <AvailabilityDialog
        isOpen={isAvailabilityDialogOpen}
        onClose={() => setIsAvailabilityDialogOpen(false)}
        staff={selectedStaff}
        onSuccess={handleStaffUpdated}
      />
    </div>
  )
}
