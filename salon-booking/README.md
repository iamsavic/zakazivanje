# Salon Booking - SaaS za Zakazivanje Termina

Moderna web aplikacija za upravljanje terminima u frizerskim salonima.

## 🚀 Tehnologije

- **Framework**: Next.js 14 (App Router)
- **Jezik**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Baza podataka**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Autentifikacija**: Supabase Auth
- **Email**: Resend + React Email
- **Deployment**: Vercel

## 📋 Funkcionalnosti

### Admin Panel
- ✅ Upravljanje frizerima (dodavanje, izmena, aktivacija/deaktivacija)
- ✅ Postavljanje radnog vremena za svakog frizera
- ✅ Blokiranje termina (godišnji odmor, bolovanje)
- ✅ Pregled i upravljanje terminima (kalendar)
- ✅ Ručno zakazivanje termina
- ✅ Potvrda/otkazivanje termina

### Javni Interface (Klijenti)
- ✅ Pregled dostupnih frizera
- ✅ Multi-step booking flow:
  1. Izbor frizera
  2. Izbor datuma
  3. Izbor vremena
  4. Unos podataka
  5. Potvrda
- ✅ Otkazivanje termina preko email linka (bez registracije)

### Email Notifikacije
- ✅ Potvrda zakazivanja (odmah nakon bookinga)
- ✅ Podsetnik 24h pre termina
- ✅ Notifikacija o otkazivanju

## 🛠️ Setup

### 1. Kreiranje Supabase projekta

1. Idi na [supabase.com](https://supabase.com) i kreiraj novi projekat
2. Nakon kreiranja, idi na Project Settings > API
3. Kopiraj URL i anon key

### 2. Environment Variables

Kreiraj `.env.local` fajl i popuni:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret
CRON_SECRET=your_random_secret_here
```

### 3. Instalacija i Migracija

```bash
# Instaliraj dependencies
npm install

# Pokreni Prisma migracije
npx prisma migrate dev --name init

# Generiši Prisma klijent
npx prisma generate
```

### 4. Kreiranje Admin Korisnika

U Supabase Dashboard:
1. Idi na Authentication > Users
2. Klikni "Add user"
3. Unesi email i password za admin nalog

### 5. Pokretanje Development Servera

```bash
npm run dev
```

Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000)

## 📁 Struktura Projekta

```
/app
  /(public)           # Javne stranice (landing, booking)
  /admin              # Admin panel (zaštićeno)
  /api                # API routes
/components
  /ui                 # shadcn/ui komponente
  /booking            # Booking komponente
  /admin              # Admin komponente
/lib
  db.ts               # Prisma klijent
  supabase.ts         # Supabase klijenti
  email.ts            # Email helper funkcije
  /types              # TypeScript tipovi
/prisma
  schema.prisma       # Database schema
/emails               # React Email template-i
```

## 🚢 Deployment

### Vercel

1. Push code na GitHub
2. Import projekat u Vercel
3. Dodaj environment variables
4. Deploy!

### Supabase Production

1. Kreiraj production database u Supabase
2. Update DATABASE_URL u Vercel environment variables
3. Pokreni migracije na production bazi

## 📧 Email Setup (Resend)

1. Kreiraj nalog na [resend.com](https://resend.com)
2. Verifikuj domen (opciono, za production)
3. Kopiraj API key u .env.local

## ⏰ Cron Jobs (Scheduled Notifications)

Vercel Cron Jobs će biti konfigurisani da šalju podserike 24h pre termina.

Endpoint: `/api/cron` - pokreće se svakih 1 sat

## 🔐 Sigurnost

- Admin panel zaštićen Supabase Auth
- Cron endpoint zaštićen secret key-em
- Environment variables nisu commit-ovane u Git
- SQL injection prevencija preko Prisma ORM

## 📝 Licenca

MIT
