<div align="center">
  <img src="public/logo.png" alt="TransitIQ Logo" width="160" />
  <h1>TransitIQ</h1>
  <p>Logistics Intelligence Platform — track, analyze, and act on shipments across FedEx, UPS, DHL, USPS, and BlueDart from a single dashboard.</p>
</div>

---

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Animation
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)

### UI & Data
![Lucide](https://img.shields.io/badge/Lucide_React-F56040?style=for-the-badge&logo=lucide&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Sonner](https://img.shields.io/badge/Sonner-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## What It Does

TransitIQ gives you a single view across multiple carriers. You can track shipments in real time, spot delays before they escalate, and get AI-powered summaries of what's actually going wrong in your logistics chain — without digging through carrier portals one by one.

**Core features:**

- **Landing page** — scroll-linked animations via GSAP and Framer Motion
- **Dashboard** — collapsible sidebar on desktop, floating bottom dock on mobile
- **Auth flow** — sign-in / sign-up screens with an onboarding carousel on mobile
- **Shipment tracking** — live status updates with filterable data tables
- **Analytics** — carrier-level charts built with Recharts (delivery rate, delay breakdown, volume over time)
- **Notifications** — toast system via Sonner

---

## AI Insights (Planned)

The next phase integrates an LLM layer on top of the analytics dashboard. The idea is to give operators plain-language answers instead of making them interpret charts themselves.

**What this will cover:**

- **Delay root-cause summaries** — when a cluster of shipments stalls, the AI surfaces the likely cause (weather, carrier backlog, address issues) based on pattern matching across historical data
- **Carrier performance reports** — weekly digest generated automatically, highlighting which carriers are underperforming against SLA and by how much
- **Anomaly flagging** — shipments that deviate from expected delivery windows get flagged with a short explanation and suggested action
- **Natural language queries** — operators can ask things like "How many DHL shipments were delayed last week in Maharashtra?" without writing a filter

**Planned stack for AI layer:**

![OpenAI](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)

The AI layer will be modular — swappable between OpenAI, Gemini, or a self-hosted model depending on deployment constraints.

---

## Getting Started

**Requirements:** Node.js v18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Credentials

The app uses a simulated auth flow. These credentials are pre-filled on the sign-in page:

| Field    | Value              |
|----------|--------------------|
| Email    | `demo@transitiq.io` |
| Password | `Demo@1234`        |

---

## Mobile

Built mobile-first. Bottom dock navigation, swipeable onboarding carousel, and viewport locking (`user-scalable=no`, `overflow-x-hidden`) to prevent the layout from breaking on iOS and Android.

---

## License

MIT
