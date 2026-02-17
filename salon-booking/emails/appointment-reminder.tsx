import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from '@react-email/components'
import { format } from 'date-fns'
import { sr } from 'date-fns/locale'

interface AppointmentReminderProps {
  clientName: string
  staffName: string
  startTime: Date
  endTime: Date
  appointmentId: string
}

export default function AppointmentReminder({
  clientName,
  staffName,
  startTime,
  endTime,
  appointmentId,
}: AppointmentReminderProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const cancelUrl = `${appUrl}/cancel/${appointmentId}`

  return (
    <Html>
      <Head />
      <Preview>Podsetnik: Vaš termin je sutra</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Podsetnik za Termin ⏰</Heading>
          
          <Text style={text}>Zdravo {clientName},</Text>
          
          <Text style={text}>
            Ovo je podsetnik da imate zakazan termin sutra:
          </Text>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Frizer:</strong> {staffName}
            </Text>
            <Text style={detailRow}>
              <strong>Datum:</strong> {format(new Date(startTime), 'EEEE, d. MMMM yyyy.', { locale: sr })}
            </Text>
            <Text style={detailRow}>
              <strong>Vreme:</strong> {format(new Date(startTime), 'HH:mm')} - {format(new Date(endTime), 'HH:mm')}
            </Text>
          </Section>

          <Text style={text}>
            Radujemo se što ćemo Vas videti!
          </Text>

          <Text style={text}>
            Ako ne možete doći, molimo vas otkažite termin:
          </Text>

          <Button href={cancelUrl} style={button}>
            Otkaži Termin
          </Button>

          <Text style={footer}>
            Hvala vam!<br />
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

const detailsBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  margin: '24px',
  padding: '24px',
}

const detailRow = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#ef4444',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '24px',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 24px',
  marginTop: '32px',
}
