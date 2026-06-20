# TransitIQ - Agent Source of Truth

## Tech Stack
- Next.js 14 App Router
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui

## Architecture & Data
- **No Database / Real Auth**: Everything is mocked in TypeScript.
- **API Shape**: 
  - Success: `{ success: true, data, meta? }`
  - Error: `{ success: false, error, message }`
- **Dashboard**: Includes an AI Insights card with hardcoded fake data.

## Brand Guidelines
- **Name**: TransitIQ
- **Colors**:
  - Indigo: `#4F46E5`
  - Violet: `#8B5CF6`
  - Cyan: `#06B6D4`

## Domain Logic
- **Shipment Statuses (6)**: `pending`, `in_transit`, `out_for_delivery`, `delivered`, `failed`, `returned`
- **Carriers (5)**: FedEx, UPS, DHL, USPS, BlueDart
- **Demo Credentials**:
  - Email: `demo@transitiq.io`
  - Password: `Demo@1234`

## 5 Most Important Operational Constraints
1. **Mocked Backend Ecosystem**: No real database or auth provider; all data, auth flows, and APIs must be mocked entirely using TypeScript and standard API route response shapes.
2. **Strict Tech Stack**: Exclusively use Next.js 14 App Router, strict TypeScript, Tailwind CSS, and shadcn/ui.
3. **Fixed Domain Logic**: Only use the 6 predefined shipment statuses, 5 specific carriers, and exact brand colors provided.
4. **Step-by-step Workflow**: Execute tasks strictly one at a time and NEVER proceed to the next task until explicitly instructed to do so.
5. **Explicit Confirmation**: Always confirm exactly which files were created or modified at the end of every task.
