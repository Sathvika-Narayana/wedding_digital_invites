# 👑 Royal Palace Wedding Digital Invitation

An ultra-premium, cinematic, mobile-first digital wedding invitation built for **Sudeepthi & Nayanadeep**. Featuring a royal Indian palace aesthetic, rich animations, and a real-time guest wishes system.

Live Preview: **[https://digitalinvites-roan.vercel.app](https://digitalinvites-roan.vercel.app)**

---

## ✨ Features

* **🎭 Cinematic Unveiling**: A royal maroon curtain parting animation with fabric textures and swaying details, unlocked by tapping a glowing gold wax seal.
* **✨ Magical Atmosphere**: Fluid particles, floating jasmine petals, and background music create a luxurious Indian palace ambiance.
* **⏳ Interactive Countdown**: A beautiful, real-time gold countdown clock showing days, hours, minutes, and seconds until the auspicious moment.
* **📍 Dynamic Logistics**: Interactive event cards showing dates, timings, venues, and embedded Google Maps navigations for each ceremony.
* **✍️ Guestbook & RSVP Form**:
  * Allows guests to send blessings and queries.
  * Real-time sync with **Google Sheets** and **Vercel KV**.
  * Instant email notifications sent to the hosts when a wish or query is submitted.
* **📊 Exporter**: Admin dashboard at `/wishes` with a one-click button to download all guest RSVPs as an Excel-compatible CSV spreadsheet.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript
* **Animations**: Framer Motion (for physics-based curtains and card transitions), Canvas-Confetti
* **Database & API**: Google Apps Script API (spreadsheet sync), Vercel Serverless Functions, Vercel KV (Redis)
* **Icons & Assets**: Lucide React, Google Fonts (Outfit, Pinyon Script, Playfair Display)

---

## 🚀 Setup & Installation

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Sathvika-Narayana/wedding_digital_invites.git

# Navigate to project folder
cd wedding_digital_invites

# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following keys to connect to Google Sheets or Vercel KV:
```env
# Google Sheets Apps Script URL (Optional)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec

# Vercel KV Credentials (Optional)
KV_REST_API_URL=https://...upstash.io
KV_REST_API_TOKEN=your-token
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the invitation.

---

## 📜 License
This project is custom-designed for the wedding of Sudeepthi & Nayanadeep. All rights reserved.
