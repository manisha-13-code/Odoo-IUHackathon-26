# CoreInventory — Frontend

Next.js 14 frontend for the CoreInventory Inventory Management System.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **React Query v5** (server state)
- **Zustand** (client state — auth)
- **React Hook Form** (form management)

## Project Structure

```
coreinventory/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup page
│   ├── dashboard/
│   │   ├── layout.tsx             # Sidebar layout (wraps all protected pages)
│   │   └── page.tsx               # KPI dashboard
│   ├── products/page.tsx          # Product catalogue
│   ├── receipts/page.tsx          # Incoming goods
│   ├── deliveries/page.tsx        # Outgoing shipments
│   ├── transfers/page.tsx         # Internal transfers
│   ├── adjustments/page.tsx       # Stock adjustments
│   ├── warehouses/page.tsx        # Warehouses + locations
│   ├── suppliers/page.tsx         # Supplier directory
│   ├── settings/page.tsx          # User settings
│   ├── layout.tsx                 # Root layout
│   ├── query-provider.tsx         # React Query client
│   └── globals.css                # Global styles
│
├── components/
│   └── shared/
│       ├── DataTable.tsx          # Reusable table with search/filter/pagination/sort
│       ├── Modal.tsx              # Modal + ConfirmDialog + FormBuilder
│       ├── KpiCard.tsx            # KpiCard + InventoryCard + PageHeader + Button
│       ├── StatusBadge.tsx        # Status tag component
│       └── Sidebar.tsx            # Navigation sidebar
│
├── lib/
│   ├── api/
│   │   └── client.ts              # All API calls (auth, products, operations, etc.)
│   └── hooks/
│       └── index.ts               # All React Query hooks
│
├── stores/
│   └── auth.ts                    # Zustand auth store
│
└── types/
    └── index.ts                   # All TypeScript types
```

## Pages

| Route | Page | Auth Required |
|---|---|---|
| `/auth/login` | Login | No |
| `/auth/signup` | Sign up | No |
| `/dashboard` | KPI overview | Yes |
| `/products` | Product catalogue | Yes |
| `/receipts` | Incoming receipts | Yes |
| `/deliveries` | Delivery orders | Yes |
| `/transfers` | Internal transfers | Yes |
| `/adjustments` | Stock adjustments | Yes |
| `/warehouses` | Warehouses + locations | Yes |
| `/suppliers` | Supplier directory | Yes |
| `/settings` | Account settings | Yes |

## Reusable Components

### `DataTable<T>`
Full-featured table with:
- Server-side search (debounced)
- Multi-filter dropdowns
- Column sorting (asc/desc)
- Pagination with page numbers
- Skeleton loading state
- Empty state

### `Modal`
Accessible modal with:
- Keyboard (Escape) + backdrop close
- Body scroll lock
- Header + footer slots
- 4 sizes: sm / md / lg / xl

### `FormBuilder<T>`
Generic form generator from a field config array:
- Supports: text, email, password, number, select, textarea, date
- react-hook-form validation
- Error messages per field
- Half-width / full-width field spans

### `KpiCard`
Dashboard KPI widget with:
- Loading skeleton
- Trend indicators (up/down)
- 5 colour variants

### `InventoryCard`
Mini product stock card with:
- Visual capacity bar
- Low stock detection
- Reorder level comparison

### `StatusBadge`
Colour-coded status pill for all operation and movement types.

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variable
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your backend

# Run dev server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Connecting to the Backend

All API calls are centralized in `lib/api/client.ts`. The client:
- Automatically attaches JWT Bearer tokens
- Auto-refreshes expired tokens via refresh token rotation
- Redirects to login on 401 (after failed refresh)

## Adding a New Page

1. Create `app/your-page/page.tsx`
2. Add your API endpoint to `lib/api/client.ts`
3. Add a React Query hook to `lib/hooks/index.ts`
4. Add the route to `components/shared/Sidebar.tsx`
5. Use `DataTable` + `Modal` + `FormBuilder` for consistency
