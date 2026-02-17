'use client'

import { Staff, Availability } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StaffWithAvailability = Staff & {
  availability: Availability[]
}

interface StaffSelectionProps {
  staff: StaffWithAvailability[]
  onSelect: (staffId: string, staffName: string) => void
}

export default function StaffSelection({ staff, onSelect }: StaffSelectionProps) {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Izaberite Frizera</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  {member.phone && (
                    <p className="text-sm text-gray-500">{member.phone}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {member.availability.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Radno vreme:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    {member.availability
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map(av => (
                        <div key={av.id}>
                          {daysOfWeek[av.dayOfWeek]}: {av.startTime} - {av.endTime}
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <Button
                className="w-full"
                onClick={() => onSelect(member.id, member.name)}
              >
                Izaberi
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Trenutno nema dostupnih frizera. Molimo pokušajte kasnije.
        </div>
      )}
    </div>
  )
}
