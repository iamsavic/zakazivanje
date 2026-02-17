import { readFileSync } from 'fs'
import { resolve } from 'path'

const placeholders = [
  'your_supabase_url',
  'your_supabase_anon_key',
  'your_supabase_service_role_key',
  'your_resend_api_key',
  'your_random_secret_here',
  '[YOUR-PASSWORD]',
]

const required = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_APP_URL',
  'CRON_SECRET',
]

function parseEnv(content) {
  const vars = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1)
    vars[key] = val
  }
  return vars
}

function isValid(val) {
  if (!val || val.length < 3) return false
  const lower = val.toLowerCase()
  return !placeholders.some(p => lower.includes(p.toLowerCase()))
}

const envPath = resolve(process.cwd(), '.env.local')
let content
try {
  content = readFileSync(envPath, 'utf-8')
} catch (e) {
  console.error('❌ .env.local nije pronađen')
  process.exit(1)
}

const vars = parseEnv(content)
let hasErrors = false

console.log('Provera env varijabli:\n')
for (const key of required) {
  const val = vars[key]
  if (!val) {
    console.log(`❌ ${key}: nije postavljen`)
    hasErrors = true
  } else if (!isValid(val)) {
    console.log(`⚠️  ${key}: izgleda kao placeholder – zameni stvarnom vrednošću`)
    hasErrors = true
  } else {
    const preview = val.length > 20 ? val.slice(0, 10) + '...' : '✓'
    console.log(`✅ ${key}`)
  }
}
console.log('')
if (hasErrors) {
  console.log('Neke varijable treba da popraviš.')
  process.exit(1)
} else {
  console.log('Sve varijable izgledaju u redu.')
  process.exit(0)
}
