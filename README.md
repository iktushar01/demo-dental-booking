# BrightSmile Dental — Modern Appointment Booking Platform

A complete, production-quality frontend-only dental clinic scheduling web application built with React, TypeScript, Tailwind CSS, and Zustand with local storage persistence.

---

## 🌟 Key Features

- **Public Clinic Website**:
  - Sticky navigation header with theme mode switcher (Light, Dark, System) and primary "Book appointment" CTA.
  - High-impact Hero section with trust metrics and clinic imagery.
  - Asymmetric Bento treatments grid with real-time pricing and procedure durations.
  - 3-step "How it works" scheduling journey.
  - Detailed dentist bios, credentials, and weekly operating hours.
  - 6 verified patient reviews and interactive FAQ accordion.
  - Clinic contact hours, directions, and emergency dental hotline.

- **Multi-Step Booking Engine (`/book`)**:
  - **Step 1: Treatment Selection**: Filter by clinical category (General, Cosmetic, Restorative, Orthodontics, Surgical).
  - **Step 2: Doctor Selection**: Choose a dedicated doctor or "Any Available Dentist" for fastest scheduling.
  - **Step 3: Interactive Date & Slot Picker**: Generates live available slots in 30-minute intervals based on dentist working hours, lunch breaks, booked appointments, admin holds, and clinic holidays. Automatically enforces past-time rules and prevents double bookings.
  - **Step 4: Patient Details**: Real-time form validation with prefilling for logged-in patients.
  - **Step 5: Simulated Payment**: Choose between paying a 20% reservation deposit online or paying upon arrival at the clinic. Includes an SSL simulated payment form with demo test card indicators.
  - **Step 6: Confirmation**: Booking code generator (e.g., `BS-8942`), downloadable `.ics` calendar file for Apple/Google/Outlook, and simulated confirmation email preview.

- **Patient Portal (`/account`)**:
  - **Overview**: Next appointment card, dental hygiene status, and quick 1-click rebooking.
  - **My Appointments**: Filter between Upcoming, Past, and Cancelled visits.
  - **Reschedule & Cancel Flow**: Reopens live date/slot picker within policy rules, with cancellation reason tracking.
  - **Profile Management**: Update name, email, phone number, date of birth, and mock password changes.
  - **Reminder Feeds**: Automated preview cards for simulated 24h email reminders and 2h SMS alerts.

- **Admin Management Console (`/admin`)**:
  - **Overview**: KPI stat cards (Today's visits, total bookings, revenue, active patient records, no-show rate), Recharts bookings timeline, and service distribution pie chart.
  - **Appointments Table**: Search, filter by status or dentist, sort, inline status dropdowns, appointment details modal, manual appointment scheduler, and CSV data export.
  - **Calendar**: Day and week views, color-coded by dentist or status, click any empty time slot to create a booking, click existing appointments to view details.
  - **Patients**: Patient directory with search, detailed chart drawer, and visit history.
  - **Dentists**: Add and edit dentists, adjust shifts, and toggle in-clinic working days.
  - **Treatments**: Add, edit, or delete procedures, adjust pricing and duration, and toggle public visibility.
  - **Availability & Closures**: Schedule custom time holds (by doctor or clinic-wide) and official clinic holiday closures.
  - **Reminders**: Toggle 24h / 2h rules and edit dynamic notification copy templates.
  - **Practice Settings & Reset**: Configure clinic branding, deposit percentages, cancellation notice windows, and a 1-click "Reset demo data" button.

---

## 🔑 Demo Credentials

A quick **"Interactive Demo Accounts"** panel is available directly on `/login` with 1-click fill buttons:

| Role | Email | Password | Redirect Target | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Clinic Admin** | `admin@demo.com` | `admin123` | `/admin` | Full clinic management, calendar, patients, hours, procedures, settings |
| **Verified Patient** | `user@demo.com` | `user123` | `/account` | View upcoming visits, reschedule, cancel, manage patient profile |

*Note: Guest bookings without prior login are fully supported on `/book`.*

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (Vite bundler)
- **Styling**: Tailwind CSS v4 + custom CSS variables
- **State & Persistence**: Zustand with `persist` middleware (`localStorage`)
- **Theme**: Light, Dark, and System preference synchronization
- **Charts & Data**: `recharts` for volume trends and procedure breakdown
- **Dates**: `date-fns` for slot generation and calendar math
- **Icons**: `lucide-react`
- **Toasts**: `sonner`

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Production Build & Vercel Deployment
```bash
npm run build
```
Generates production-optimized assets in the `dist` directory.

#### Deploying on Vercel:
The project is configured with `/vercel.json` for 1-click Vercel deployment:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Single Page Application (SPA) Rewrites**: Automatically routes all deep links (`/book`, `/services`, `/dentists`, `/account`, `/admin`, `/login`, `/register`) to `/index.html` preventing 404 errors on direct navigation and browser refreshes.

To deploy via Vercel CLI:
```bash
npx vercel
```
Or connect your GitHub repository directly to Vercel — it will auto-detect Vite and deploy immediately.

---

## 🌓 Dark & Light Mode

- Configured with Tailwind CSS v4 class-based variant: `@custom-variant dark (&:where(.dark, .dark *));`.
- Instant 1-click switcher in the header navigation (Sun / Moon) and admin console.
- Synchronized with `localStorage` and system `prefers-color-scheme`.
- Distinct color variables tailored for both light surfaces and deep dark clinical contrast.
