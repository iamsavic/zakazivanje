# Deployment Guide - Salon Booking

## 🚀 Pre-deployment Checklist

Pre nego što deploy-ujete aplikaciju, završite sledeće korake:

### 1. Kreiranje Supabase Projekta

1. Idite na [supabase.com](https://supabase.com) i napravite novi projekat
2. Nakon kreiranja projekta:
   - Idite na **Project Settings > API**
   - Kopirajte **URL** i **anon** ključ
   - Kopirajte **service_role** ključ (sa Project Settings > API)
   - Idite na **Project Settings > Database**
   - Kopirajte **Connection String** (select "Transaction" mode)

### 2. Kreiranje Resend Naloga

1. Idite na [resend.com](https://resend.com) i napravite nalog
2. Kreirajte novi API ključ
3. (Opciono) Verifikujte svoj domen za production

### 3. Generisanje CRON_SECRET

Generišite random secret za zaštitu cron endpoint-a:

```bash
openssl rand -base64 32
```

## 📦 Vercel Deployment

### Korak 1: Push kod na GitHub

```bash
cd salon-booking
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Korak 2: Connect Vercel

1. Idite na [vercel.com](https://vercel.com)
2. Kliknite **"Add New Project"**
3. Import-ujte GitHub repozitorijum
4. Framework Preset: **Next.js** (auto-detected)

### Korak 3: Environment Variables

Dodajte sledeće environment variables u Vercel:

```env
# Database (Supabase)
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (Email)
RESEND_API_KEY=re_xxx

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Cron Secret
CRON_SECRET=your_random_secret_here
```

### Korak 4: Deploy

1. Kliknite **"Deploy"**
2. Sačekajte da se build završi (~2-3 minuta)

## 🗄️ Database Setup

Nakon što je aplikacija deploy-ovana, treba da pokrenete migracije:

### Opcija A: Prisma Migrate (Preporučeno)

```bash
# Lokalno (sa production DATABASE_URL)
npx prisma migrate deploy
```

### Opcija B: Prisma DB Push (Development)

```bash
npx prisma db push
```

### Opcija C: Ručno izvršavanje SQL-a

Kopirajte SQL kod iz `prisma/schema.prisma` i izvršite ga u Supabase SQL Editor.

## 🌱 Seed Database (Opciono)

Da biste dodali testne podatke:

```bash
npm run db:seed
```

## 🔐 Kreiranje Admin Korisnika

1. Idite na Supabase Dashboard
2. **Authentication > Users**
3. Kliknite **"Add user"**
4. Unesite email i password
5. Kliknite **"Create user"**

Sada se možete prijaviti na `/admin/login` sa tim credentials-ima.

## ⏰ Vercel Cron Jobs

Vercel Cron Jobs su automatski konfigurisani putem `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

Ovo će pokretati reminder job svakih 4 sata.

### Testiranje Cron Job-a

```bash
curl -X GET https://your-domain.vercel.app/api/cron/send-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🔍 Post-Deployment Testing

### 1. Test Landing Page
- Idite na `https://your-domain.vercel.app`
- Proverite da se landing page učitava

### 2. Test Admin Login
- Idite na `https://your-domain.vercel.app/admin/login`
- Prijavite se sa admin credentials
- Proverite da možete pristupiti dashboard-u

### 3. Test Staff Management
- Dodajte novog frizera
- Podesite radno vreme
- Proverte da se izmene čuvaju

### 4. Test Booking Flow
- Idite na `https://your-domain.vercel.app/book`
- Prođite kroz kompletan booking flow
- Proverite da stižu email notifikacije

### 5. Test Email Delivery
- Zakažite termin
- Proverite da stigne confirmation email
- Testirajte cancel link u email-u

## 🐛 Troubleshooting

### Problem: Database Connection Error

**Rešenje:**
- Proverite da li je `DATABASE_URL` pravilno podešen
- Proverite da li ste pokrenuli migracije
- Verifikujte da Supabase projekat radi

### Problem: Email-ovi se ne šalju

**Rešenje:**
- Proverite `RESEND_API_KEY`
- Proverite logs u Vercel Dashboard
- Verifikujte domen u Resend dashboard-u

### Problem: Cron job ne radi

**Rešenje:**
- Proverite `CRON_SECRET`
- Verifikujte `vercel.json` konfiguraciju
- Proverite logs u Vercel > Cron Jobs

### Problem: Build Failed

**Rešenje:**
- Proverite TypeScript errors: `npm run build`
- Proverite linter errors: `npm run lint`
- Proverite da su sve environment variables podešene

## 📊 Monitoring

### Vercel Dashboard

- **Deployments**: Pratite deploy history
- **Analytics**: Pratite broj poseta
- **Logs**: Real-time logs za debugging
- **Cron Jobs**: Pratite izvršavanje cron job-ova

### Supabase Dashboard

- **Database**: Pratite queries i performance
- **Auth**: Pratite user registracije i login-e
- **API Logs**: Pratite API calls

## 🔄 Continuous Deployment

Nakon inicijalnog deploy-a, svaki git push na `main` branch će automatski triggerovati novi deployment:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel će automatski:
1. Build-ovati aplikaciju
2. Pokrenuti testove (ako postoje)
3. Deploy-ovati novu verziju
4. Rollback ako build fail-uje

## 📈 Scaling

Kada aplikacija poraste, razmislite o:

1. **Database Optimization**
   - Dodajte indexes na često korišćene kolone
   - Optimizujte queries
   - Upgrade Supabase plan

2. **Vercel Pro Plan**
   - Više cron jobs
   - Bolje analytics
   - Prioritetan support

3. **Email Service**
   - Upgrade Resend plan za više email-ova

## 🎉 Gotovo!

Vaša aplikacija je sada live! 🚀

Za dodatnu pomoć:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
