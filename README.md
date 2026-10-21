# Student Scholarship Monitoring and Academic Compliance System
**Systems Analysis and Design (SAD) Comprehensive Laboratory Examination - Section B**

A minimum viable browser-based web application for scholarship administration, verification, compliance evaluation, and renewal decisions.

---

## Quick Setup and Run Instructions

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run automated exam test suite (TC01 - TC10)
npm run test:exam
```

---

## Test Accounts & Role Simulation

The app contains an active **Role Switcher** in the top navigation header:

1. **Staff Account:**
   - **User:** `Scholarship Admin Staff` (`STAFF01`)
   - **Capabilities:** Verify documents, trigger compliance evaluations, approve/hold renewals, re-assign policies, view audit logs.

2. **Scholar Accounts (B01 - B06):**
   - **B01 (Juan Dela Cruz):** Excellence Scholar (Boundary Test)
   - **B02 (Maria Clara):** Excellence Scholar (GWA Deficiency)
   - **B03 (Crisostomo Ibarra):** Access Scholar (Compliant with 1 Dropped)
   - **B04 (Elias Salome):** Access Scholar (Multiple Deficiencies)
   - **B05 (Sisa Basilio):** Excellence Scholar (Failed Subject & Late Submission)
   - **B06 (Jose Rizal):** Access Scholar (Pending Verification Gate)

---

## Supabase Database Setup (Optional Cloud Link)

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Execute the migration script in `supabase/schema.sql` inside the Supabase SQL Editor.
3. Populate synthetic test records using `supabase/seed.sql`.
4. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## Architecture & Status Field Separation

The application enforces strict separation across three status fields:
- `verification_status`: `Pending verification` | `Verified` | `Returned`
- `compliance_status`: `Pending` | `Compliant` | `With Deficiency`
- `renewal_decision`: `Pending` | `Approved` | `Held`

---

## Known Limitations / Examination Scope Exclusions
- Live Registrar API integration is omitted (evidence documents are user-supplied links).
- SMS and email notification gateways are excluded per exam guidelines.
- Official money disbursements are outside system boundary.
