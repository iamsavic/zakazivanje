import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'
import { sr } from 'date-fns/locale'

interface AppointmentCancelledProps {
  clientName: string
  staffName: string
  startTime: Date
}

export default function AppointmentCancelled({
  clientName,
  staffName,
  startTime,
}: AppointmentCancelledProps) {
  return (
    <Html>
      <Head />
      <Preview>Vaš termin je otkazan</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Termin Otkazan</Heading>
          
          <Text style={text}>Zdravo {clientName},</Text>
          
          <Text style={text}>
            Vaš termin je uspešno otkazan:
          </Text>

          <Text style={detailText}>
            <strong>Frizer:</strong> {staffName}<br />
            <strong>Datum:</strong> {format(new Date(startTime), 'EEEE, d. MMMM yyyy. u HH:mm', { locale: sr })}
          </Text>

          <Text style={text}>
            Možete zakazati novi termin u bilo kom trenutku putem naše web stranice.
          </Text>

          <Text style={footer}>
            Hvala vam na razumevanju!<br />
            Vaš Salon Tim
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 24px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 24px',
}

const detailText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 24px',
  backgroundColor: '#fee2e2',
  borderRadius: '8px',
  margin: '24px',
  padding: '24px',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 24px',
  marginTop: '32px',
}
