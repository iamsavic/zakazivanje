import { Resend } from 'resend'

let _resend: Resend | undefined
function getResend(): Resend {
  if (_resend) return _resend
  _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const { data, error } = await getResend().emails.send({
      from: 'Salon <onboarding@resend.dev>', // Change this to your domain
      to,
      subject,
      react,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
