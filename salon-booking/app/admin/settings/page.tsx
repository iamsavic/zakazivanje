import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Podešavanja</h1>
        <p className="text-gray-500 mt-1">Konfiguriši aplikaciju</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opšta Podešavanja</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Podešavanja aplikacije - implementiraće se kasnije
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
