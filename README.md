<div align="center">
  <img src="public/logo.png" alt="TransitIQ Logo" width="200" />
</div>

# TransitIQ

TransitIQ is a modern, high-fidelity Logistics Intelligence Platform built as a robust dashboard and landing page system. It provides comprehensive visibility across logistics networks (FedEx, UPS, DHL, USPS, BlueDart) through a seamless, premium user interface.

## 🚀 Features

- **Dynamic Landing Page**: High-performance, animated entry point utilizing GSAP and Framer Motion for scroll-linked animations and smooth visual transitions.
- **Responsive Dashboard Architecture**: 
  - Desktop: Collapsible sidebar navigation.
  - Mobile: Floating bottom dock and native-feeling top headers with strict viewport locking to prevent horizontal overflow.
- **Robust Authentication Flow**: Interactive Sign-In and Sign-Up screens with mobile-optimized onboarding carousels and layout overlays.
- **Comprehensive Analytics & Tracking**: Real-time shipment status tracking, statistical overviews using Recharts, and interactive data tables.
- **Custom UI Components**: Built completely independent of heavy UI libraries for critical components (like the Profile Menu) to ensure 100% crash-free stability and pixel-perfect design.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📦 Getting Started

### Prerequisites

Ensure you have Node.js installed (v18 or higher recommended).

### Installation

1. Clone the repository and navigate into the project directory:

```bash
cd transitiq
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🔐 Authentication

The application uses a simulated authentication flow for demonstration purposes.

- **Demo Credentials** (Pre-filled on the Sign-In page):
  - **Email**: `demo@transitiq.io`
  - **Password**: `Demo@1234`
- **Session Management**: Auth state is maintained via Next.js server actions and API routes.

## 📱 Mobile Responsiveness

TransitIQ is built with a **Mobile-First** philosophy:
- Uses `viewport` constraints (`user-scalable=false`, `max-w-[100vw]`, `overflow-x-hidden`) to mimic native application behavior on iOS and Android.
- Features bottom navigation docks, swipeable carousels, and optimized padding adjustments for varying device aspect ratios.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
