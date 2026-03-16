# Fyaora Waitlist Frontend

This project implements the **Fyaora waitlist / human resources page** with a rich data-table experience, using **React + TypeScript + Vite + MUI + TanStack Table**.

### Features

- **Waitlist table**
  - Server‑style client-side pagination, sorting, and filtering (powered by TanStack Table and a `getWaitList` helper over `public/data/waitlist.json`).
  - Columns for email, phone, postcode, vendor type, service offering, signup date, and status.
  - Bulk selection and action bar.

- **Filtering & search**
  - Left **FilterBar** with:
    - Postcode text filter.
    - Registration status, vendor type, and service offering checkboxes.
    - Date range filter (start/end) over `dateRegistered` (inclusive, using `getTime()`).
  - Global search over common fields, synced with the URL.
  - Filters, sort, pagination, search, and type (service‑providers/customers) are all reflected in URL query params via **nuqs**.

- **Waitlist details**
  - Row “Edit” action opens a **UserDetailDialog** with:
    - User details header chips (type + status).
    - Contact information, customer/provider details, and service offering.
    - Internal notes section with inline **Edit → Save/Cancel** and a read‑only default state.
    - **Onboard** and **Reject** actions that close the dialog and show a success toast.

- **Global toast system**
  - `ToastProvider` + `useToast` context, rendering a single `SuccessSnackbar` at app root.
  - Any component can call `useToast().showToast('Message')` to show a styled success toast.
  - Used by:
    - FilterBar (via `WaitListTableWrapper`) → “Filters applied successfully.”
    - UserDetailDialog → “User onboarded successfully.” / “User rejected.”

- **Layout & responsiveness**
  - `MainLayout` with header navigation and page layout.
  - **Header**: desktop nav buttons plus mobile hamburger that opens a `MobileNavDrawer`.
  - **FilterBar**:
    - Desktop: sticky sidebar.
    - Mobile: opens inside a left `Drawer` via a “Filters” button.
  - Pagination UI matches the provided design (Prev / Next + page numbers with custom theme tokens and hover states).

### Tech stack

- **React 19 + TypeScript + Vite**
- **MUI v7** for layout, theming, dialogs, drawers, buttons, etc.
- **TanStack Table** for table state and rendering.
- **nuqs** (with React Router v7 adapter) for URL‑driven table/query state.
- **dayjs** for date formatting and parsing.

### Running the app

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/waitlist`.

### Key files

- Waitlist page wrapper: `src/components/waitlist/WaitListTableWrapper.tsx`
- Table: `src/components/waitlist/WaitListTable.tsx`
- Columns: `src/components/waitlist/WaitlistTableColumns.tsx`
- Waitlist filtering logic: `src/lib/get-waitlist.ts`
- Filter sidebar: `src/components/waitlist/FilterBar.tsx`
- User detail modal: `src/components/waitlist/UserDetailDialog.tsx`
- Global toast context: `src/contexts/ToastContext.tsx`, `src/contexts/useToast.ts`, `src/contexts/toastContext.ts`
- Toast UI: `src/components/ui/SuccessSnackbar.tsx`