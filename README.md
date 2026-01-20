# Turbo Lamp

A modern contact management application built with TanStack Router, TanStack Query, and React.

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Build

```bash
pnpm build
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check` - Format and fix linting issues

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **TanStack Form** - Form state management
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Zod** - Schema validation
- **Vite** - Build tool

## Project Structure

```text
turbo-lamp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── formComponents.tsx
│   │   └── Header.tsx
│   │
│   ├── features/            # Feature-based modules
│   │   └── users/           # User/Contact feature
│   │       ├── api.users.ts        # API calls (server functions)
│   │       ├── models.users.ts     # User schema & types
│   │       ├── rqOptions.user.ts   # React Query options
│   │       └── components/         # Feature-specific components
│   │           ├── userAvatar.tsx
│   │           ├── userDetail.tsx
│   │           ├── userForm.tsx
│   │           └── usersList.tsx
│   │
│   ├── routes/              # File-based routes (TanStack Router)
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Home page (contacts list)
│   │   ├── new.tsx          # Create new contact
│   │   └── $userId/         # Dynamic user routes
│   │       ├── index.tsx    # User detail page
│   │       └── edit.tsx     # Edit user page
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAppForm.ts    # Form wrapper hook
│   │   └── useIntersectionObserver.ts
│   │
│   ├── lib/                 # Utility libraries
│   │   ├── mergeMutationOptions.ts  # React Query mutation merging
│   │   └── utils.ts         # General utilities
│   │
│   ├── integrations/        # Third-party integrations
│   │   └── tanstack-query/  # React Query setup
│   │       ├── root-provider.tsx
│   │       └── devtools.tsx
│   │
│   ├── router.tsx           # Router configuration
│   └── routeTree.gen.ts     # Auto-generated route tree
│
├── DB/                      # Database/data layer
│   ├── index.ts             # Data access functions
│   └── initialData.json     # Initial seed data
│
└── public/                  # Static assets
```

### Key Concepts

#### Feature-Based Organization

The `features/` directory follows a feature-first approach:

- Each feature (e.g., `users/`) contains its own API calls, models, React Query options, and components
- All feature-related code is kept together within the feature directory
- This improves maintainability and makes it easier to understand feature boundaries

#### File-Based Routing

Routes are defined in `src/routes/`:

- File names map to URLs (e.g., `new.tsx` → `/new`)
- Dynamic segments use `$` prefix (e.g., `$userId/index.tsx` → `/:userId`)
- The `__root.tsx` file defines the app layout

#### Server Functions

API calls use TanStack Start server functions in `api.users.ts`:

- Server-side logic with automatic type safety
- No need for manual fetch/axios setup
- Integrated with React Query for caching and synchronization

## Development Guidelines

### Adding Components

Use Shadcn CLI to add new UI components:

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Adding Routes

Create a new file in `src/routes/` - TanStack Router will automatically detect it.

### Code Quality

This project uses:

- **ESLint** - Code linting (TanStack config)
- **Prettier** - Code formatting
- **TypeScript** - Type checking

Run `pnpm check` before committing to format and fix issues automatically.

## Learn More

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Form](https://tanstack.com/form)
- [Shadcn UI](https://ui.shadcn.com)
