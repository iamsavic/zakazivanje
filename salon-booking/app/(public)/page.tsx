import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock, CheckCircle, Users } from 'lucide-react'
import { prisma } from '@/lib/db'

export default async function HomePage() {
  const staff = await prisma.staff.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { appointments: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Zakažite Vaš Termin <br />
            <span className="text-indigo-600">Brzo i Jednostavno</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Izaberite vreme koje vam odgovara i potvrdite termin u nekoliko klikova
          </p>
          <Link href="/book">
            <Button size="lg" className="text-lg px-8 py-6">
              <Calendar className="mr-2 h-5 w-5" />
              Zakaži Termin
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Zašto izabrati nas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Brzo Zakazivanje</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Zakažite termin u nekoliko klikova bez potrebe za registracijom
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Automatska Potvrda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dobijte email potvrdu odmah nakon zakazivanja termina
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Podsetnici</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Primite email podsetnik 24h pre vašeg termina
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Staff Section */}
      {staff.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Naš Tim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {member._count.appointments} zadovoljnih klijenata
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Spremni za novi izgled?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Zakažite svoj termin danas i osetite razliku
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Započni Zakazivanje
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Salon Booking. Sva prava zadržana.
          </p>
        </div>
      </footer>
    </div>
  )
}
