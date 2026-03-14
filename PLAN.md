# Waitlist → Service Providers Page — Implementation Plan

**Stack:** React + Material UI (MUI)  
**Reference:** fyaora LABS Frontend Developer Assignment 2025

---

## 1. Project Setup

| Task | Details |
|------|---------|
| **Scaffold** | Create React app (Vite or CRA) with TypeScript |
| **Dependencies** | `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` |
| **Routing** | React Router (if multi-page) or single page with one route |
| **State** | React state + context or lightweight store for filters, selection, pagination |
| **Data** | Mock JSON (≥50 rows) for 5+ pages at 10 rows/page; match column schema below |

---

## 2. Data Model & Mock Data

**Table row shape:**

- `id` (unique)
- `email`
- `phoneNumber`
- `postcode` (UK format)
- `vendorType`: `"Independent"` \| `"Company"`
- `serviceOffering`: `"Housekeeping"` \| `"Window Cleaning"` \| `"Car Valet"`
- `signupDate` (ISO or formatted string)
- `status`: `"Onboarded"` \| `"Rejected"`

**Mock data:** Generate 50+ rows with varied values for postcodes, dates, vendor types, service offerings, and statuses so pagination, sorting, and all filters work.

---

## 3. Layout & Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header / Title (optional)                                   │
├──────────────┬──────────────────────────────────────────────┤
│              │  [Search bar — top right]                     │
│  Sidebar     │  ┌──────────────────────────────────────────┐ │
│  Filters     │  │  Table (10 rows/page, pagination, etc.)  │ │
│              │  └──────────────────────────────────────────┘ │
│  (collapses  │                                               │
│   on mobile) │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

- **Sidebar:** MUI `Drawer` (persistent on desktop, temporary/collapsible on small screens) or responsive grid that stacks on mobile.
- **Main:** MUI `Box`/`Container` with search aligned top-right, then table.

---

## 4. Table (Section 1)

| Requirement | Implementation |
|-------------|----------------|
| **Columns** | Email, Phone Number, Postcode, Vendor Type, Service Offering, Signup Date, Status, Actions |
| **Pagination** | MUI `TablePagination` — 10 rows per page, 5+ pages (so 50+ rows in mock data) |
| **Sorting** | MUI `TableSortLabel` on each column; sort state (column + direction); apply to current page data or full dataset before slicing |
| **Filtering** | Combine sidebar filters + search bar; filter full dataset, then sort, then paginate |
| **Row selection** | Checkbox column; state: `selectedIds: Set<string>`; “Select All” = all on current page or all filtered (per spec: “Select All” working) |
| **Actions** | “Edit” icon (e.g. `Edit` from `@mui/icons-material`); onClick → open MUI `Dialog` (modal) or `navigate()` dummy redirect |

**Component split:**  
`ServiceProvidersTable` (container with state) + `TableToolbar` (optional: “Select All” summary) + MUI `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`.

---

## 5. Sidebar Filters (Section 2)

| Field | Control | Notes |
|-------|---------|--------|
| **Postcode** | MUI `TextField` | UK ZIP; validate/format as needed (e.g. allow spaces) |
| **Registration Status** | MUI `Select` or `RadioGroup` | Options: Onboarded, Rejected |
| **Date Registered** | Two MUI `TextField` + date picker or `type="date"` | Start date + End date; format MM/DD/YYYY |
| **Vendor Type** | Select / Radio | Independent, Company |
| **Service Offering** | Select / Checkboxes | Housekeeping, Window Cleaning, Car Valet |
| **Buttons** | MUI `Button` | “Apply Filters” — apply current sidebar values to table data; “Clear Filters” — reset all filter fields and applied state |

**State:** Hold “form” state in sidebar (postcode, status, startDate, endDate, vendorType, serviceOffering). On “Apply Filters”, copy to app-level filter state used for table. “Clear” resets both form and applied filters.

---

## 6. Main Content (Section 3)

| Item | Implementation |
|------|----------------|
| **Search bar** | MUI `TextField` (with search icon); position top-right (e.g. `alignSelf: 'flex-end'` or grid). Filter by: email, phone, postcode (or as per design). **Behaviour:** filter on Enter and/or live (onChange debounced ~300 ms). Normalize: `trim()` and allow partial match (e.g. `row.email.toLowerCase().includes(search.trim().toLowerCase())`). |
| **Table** | As in §4; data = filtered (sidebar + search) then sorted then paginated. |
| **Status column** | Render “Onboarded” or “Rejected” (e.g. with `Chip` or plain text). |
| **Actions column** | Edit icon → modal or dummy redirect. |

---

## 7. Responsiveness (Section 4)

| Target | Approach |
|--------|----------|
| **Sidebar** | Use MUI `Drawer` with `variant="permanent"` on large breakpoint and `variant="temporary"` on small; or CSS grid that stacks (sidebar above table on small screens). Toggle button to open/close sidebar on mobile. |
| **Table** | Wrap table in `TableContainer` with `sx={{ overflowX: 'auto' }}` so horizontal scroll appears on small devices. Consider sticky first column (e.g. checkbox + email) if design allows. |

Use MUI `useMediaQuery` or `sx` breakpoints for layout and drawer variant.

---

## 8. Bonus (Section 5)

| Enhancement | Implementation |
|-------------|----------------|
| **Success feedback** | MUI `Snackbar` + `Alert`: show “Filters applied” after Apply; “Action completed” (or similar) after Edit in modal/redirect. Auto-hide after 3–4 seconds. |
| **Hover & transitions** | MUI `TableRow`: `sx={{ '&:hover': { backgroundColor: 'action.hover' } }}`; buttons/cards with `transition: 'all 0.2s'`; sidebar open/close with transition. |

---

## 9. File Structure (Suggested)

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx      # Sidebar + main area
│   │   └── SidebarFilters.tsx # Filter form + Apply/Clear
│   ├── table/
│   │   ├── ServiceProvidersTable.tsx  # State, pagination, sort, selection
│   │   ├── TableToolbar.tsx          # Search bar (or in layout)
│   │   └── EditProviderModal.tsx      # Modal for Edit action
├── data/
│   └── mockProviders.ts       # Mock 50+ rows
├── hooks/
│   └── useFilters.ts          # Filter state + apply/clear logic
└── types/
    └── provider.ts            # ServiceProvider type
```

---

## 10. Implementation Order

1. **Setup** — Create React + MUI project; add mock data and types.
2. **Layout** — App layout with sidebar placeholder and main content area; make sidebar responsive (collapse/stack).
3. **Table** — Render table with all columns and mock data; add pagination (10 per page).
4. **Sorting** — Add sort state and sort labels to each column.
5. **Row selection** — Checkboxes + “Select All” and clear selection.
6. **Sidebar filters** — All filter fields + Apply/Clear; wire to filter logic (no UI table filter yet).
7. **Filter logic** — Combine sidebar filters + search; apply to data before sort and pagination.
8. **Search bar** — Position top-right; wire to filter (live or on Enter); trim and partial match.
9. **Actions** — Edit icon → open modal or dummy redirect.
10. **Polish** — Responsive table (horizontal scroll); success Snackbar; hover and transitions.

---

## 11. Checklist (from assignment)

- [ ] Table: Email, Phone Number, Postcode, Vendor Type, Service Offering, Signup Date, Status, Actions
- [ ] 10 rows per page, pagination (minimum 5 pages)
- [ ] Sorting and filtering work on all columns
- [ ] Row checkbox + “Select All”
- [ ] Action (Edit) opens modal or dummy redirect
- [ ] Sidebar: Postcode, Registration Status, Date Range, Vendor Type, Service Offering
- [ ] Apply Filters / Clear Filters
- [ ] Search bar top-right; live or Enter; partial + trim
- [ ] Status: Onboarded / Rejected
- [ ] Sidebar collapses/stacks on small screens
- [ ] Table scrolls horizontally on small devices
- [ ] (Bonus) Success message after filters/action
- [ ] (Bonus) Hover effects and smooth transitions

---

*Plan for fyaora LABS Frontend Developer Assignment 2025 — React + Material UI.*
