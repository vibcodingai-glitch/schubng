# ChainCred Codebase Documentation

## 1. Project Overview
**ChainCred** is a professional credential verification platform designed to bridge the gap between professionals and verifying bodies. It allows users to upload certifications, get them verified, and share a trusted public profile. Administrators can manage users and process verification requests.

## 2. Technology Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Fonts:** Plus Jakarta Sans (via `next/font`)

## 3. Project Structure
The project follows a standard Next.js App Router structure with a `src` directory.

```
src/
├── app/                    # App Router pages and layouts
│   ├── (admin)/            # Admin portal routes (grouped)
│   ├── (auth)/             # Authentication routes (grouped)
│   ├── (dashboard)/        # User dashboard routes (grouped)
│   ├── (marketing)/        # Public marketing pages (grouped)
│   ├── (public)/           # Publicly accessible profiles
│   ├── components-showcase/# Dev-only component gallery
│   ├── globals.css         # Global styles and Tailwind directives
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── layout/             # Layout components (Sidebars, Headers)
│   ├── profile/            # Profile-related components
│   ├── shared/             # Reusable business components
│   └── ui/                 # Base UI components (Shadcn)
├── data/                   # Mock data for development
├── lib/                    # Utility functions (cn, etc.)
└── types/                  # TypeScript type definitions
```

## 4. Key Modules & Routes

### 4.1 Marketing Pages `(marketing)`
Public-facing pages designed to convert visitors.
- **Layout:** Uses a specific `Header` with navigation and a `Footer`.
- **Pages:**
    - `/`: Homepage (Hero, Features, Social Proof, CTA).
    - `/about`: Company mission and story.
    - `/pricing`: Pricing tiers.

### 4.2 Authentication `(auth)`
Handles user access.
- **Layout:** `AuthLayout` centers content in a responsive card.
- **Pages:**
    - `/login`: User sign-in.
    - `/register`: Multi-step registration form.
    - `/forgot-password` & `/reset-password`: Account recovery.

### 4.3 User Dashboard `(dashboard)`
The core application for regular users.
- **Layout:** `DashboardLayout` features:
    - **Desktop:** Fixed left sidebar (`DashboardSidebar`).
    - **Mobile:** Bottom navigation bar (`MobileBottomNav`).
- **Pages:**
    - `/dashboard`: Overview (Stats, Trust Score).
    - `/dashboard/certifications`: List and Add (`/add`) certifications.
    - `/dashboard/verifications`: Track verification status.
    - `/dashboard/profile`: Manage user profile (Basic, Experience, Education).
    - `/dashboard/billing`: Payment history and plan management.
    - `/dashboard/settings`: Account settings.

### 4.4 Admin Portal `(admin)`
Interface for platform administrators.
- **Layout:** `AdminLayout` features:
    - **Desktop:** Fixed sidebar (`AdminSidebar`).
    - **Mobile:** Drawer-based navigation (Shadcn `Sheet`).
- **Pages:**
    - `/admin`: Dashboard overview (Charts, Pending Tasks).
    - `/admin/users`: User management table.
    - `/admin/verifications`: Verification queue and details (`/[id]`).

### 4.5 Public Profile `(public)`
- **Route:** `/p/[username]`
- **Description:** A public-facing page displaying a user's verified credentials and trust score. Designed to be shared on social media or resumes.

## 5. Component Architecture

### 5.1 UI Library (`src/components/ui`)
Reusable, atomic components built with Shadcn UI and Tailwind. Examples: `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Sheet`, `Table`.

### 5.2 Shared Components (`src/components/shared`)
Business-logic components used across multiple modules:
- `TrustScoreBadge`: Visual indicator of user trust level.
- `VerificationBadge`: Status badge (Verified, Pending, etc.).
- `CertificationCard`: Displays certification details.
- `UserAvatar`: Standardized avatar with fallback.
- `StatCard`: Dashboard statistic display.
- `FileUpload`: Drag-and-drop file input.

### 5.3 Layout Components (`src/components/layout`)
- `DashboardSidebar`: Main navigation for users.
- `AdminSidebar`: Main navigation for admins.
- `MobileBottomNav`: Mobile-only navigation for the user dashboard.
- `Header`: Marketing site header.

## 6. Responsiveness Strategy
The application is fully responsive, adhering to a mobile-first design philosophy.
- **Grid Systems:** Extensive use of `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` to adapt layouts.
- **Tables:** All tables are wrapped in `overflow-x-auto` containers to prevent breaking layouts on small screens.
- **Navigation:**
    - **Marketing/Admin:** Hamburger menu triggering a slide-out drawer.
    - **Dashboard:** Switches from Sidebar (Desktop) to Bottom Nav (Mobile).
- **Typography:** Responsive font sizes using Tailwind's `text-sm md:text-base` utilities.

## 7. Development & Deployment

### Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint.

### Environment Variables
(See `.env.example` for reference)
- No external API keys are currently required for the mock version.

## 8. Mock Data
The application currently runs on static mock data located in `src/data/mock-data.ts`. This allows for full UI/UX testing without a backend connection.

### 8.1 Data Structure
- **10 Sample Users**: Nigerian professionals across various industries (Oil & Gas, FMCG, Telecom, Banking).
- **10 Sample Certifications**: Including CSCP, CIPS, PMP, Six Sigma, CPIM with various verification statuses.
- **5 Sample Transactions**: Payment records for verifications and subscriptions.
- **2 Admin Users**: For admin panel testing.
- **Work Experience & Education**: Profile data for select users.

### 8.2 Helper Functions
```typescript
getUserById(id: string): User | undefined
getCertificationsByUserId(userId: string): Certification[]
getTransactionsByUserId(userId: string): Transaction[]
```

---

## 9. TypeScript Type System

### 9.1 Core Types (`src/types/index.ts`)

#### User Types
```typescript
type UserRole = "professional" | "admin"

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    headline?: string;
    summary?: string;
    profilePhoto?: string;
    location?: { state: string; city?: string };
    linkedInUrl?: string;
    currentRole?: string;
    currentCompany?: string;
    industry?: string;
    yearsOfExperience?: string;
    plan: 'free' | 'verified_pro';
    trustScore: number;
    isProfilePublic: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Professional extends User {
    username: string;
    certifications: Certification[];
    experiences: WorkExperience[];
    education: Education[];
    skills: string[];
}
```

#### Certification Types
```typescript
type VerificationStatus = 
    | 'unverified' 
    | 'pending' 
    | 'in_review' 
    | 'verified' 
    | 'failed' 
    | 'expired';

interface Certification {
    id: string;
    userId: string;
    type: string;
    issuingBody: string;
    credentialId: string;
    issueDate: string;
    expiryDate?: string | null;
    documentUrl?: string;
    verificationStatus: VerificationStatus;
    verifiedDate?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
}
```

#### Transaction Types
```typescript
type PaymentStatus = "pending" | "successful" | "failed";

interface Transaction {
    id: string;
    userId: string;
    type: 'verification' | 'subscription' | 'bundle';
    amount: number;
    currency: 'NGN';
    status: PaymentStatus;
    reference: string;
    description: string;
    createdAt: string;
}
```

### 9.2 Constants & Enums
The `types/index.ts` file also exports critical constants:
- **`CERTIFICATION_TYPES`**: Categorized list of 20+ supply chain certifications.
- **`NIGERIAN_STATES`**: All 36 states + FCT.
- **`INDUSTRIES`**: 18 Nigerian industry sectors.
- **`JOB_ROLES`**: 16 common supply chain roles.
- **`SUPPLY_CHAIN_SKILLS`**: 22 key skills.
- **`VERIFICATION_STATUS_CONFIG`**: Maps statuses to colors and icons.
- **`PRICING`**: Platform pricing structure.
- **`ROUTES`**: Centralized route definitions.

---

## 10. Styling System

### 10.1 Tailwind Configuration
ChainCred uses a custom Tailwind configuration with:
- **Design Tokens**: CSS variables for colors (`--primary`, `--secondary`, etc.).
- **Custom Colors**: Chart colors, destructive states, muted backgrounds.
- **Custom Animations**: `fade-in`, `slide-up`, `pulse-gentle`.
- **Font**: Plus Jakarta Sans (loaded via `next/font`).

### 10.2 Global CSS (`src/app/globals.css`)
Defines:
- CSS custom properties for theming.
- Base styles and Tailwind directives.
- Scrollbar customization.

### 10.3 Utility Functions (`src/lib/utils.ts`)
```typescript
cn(...inputs: ClassValue[]): string
// Merges Tailwind classes intelligently, resolving conflicts

formatCurrency(amount: number): string
// Formats numbers as Nigerian Naira (₦)

formatDate(date: Date | string): string
// Formats dates in Nigerian locale

getTrustScoreLevel(score: number): "high" | "medium" | "low"
// Categorizes trust scores
```

---

## 11. Component Architecture (Detailed)

### 11.1 Shared Components (`src/components/shared`)

#### TrustScoreBadge
**Purpose:** Displays user trust score with visual indicator.
**Props:**
```typescript
interface TrustScoreBadgeProps {
    score: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}
```
**Usage:** Dashboard overview, public profiles.

#### VerificationBadge
**Purpose:** Shows certification verification status.
**Props:**
```typescript
interface VerificationBadgeProps {
    status: VerificationStatus;
    size?: "sm" | "md";
}
```
**Styling:** Color-coded based on status (green=verified, amber=pending, red=failed).

#### CertificationCard
**Purpose:** Displays certification details in a card layout.
**Props:**
```typescript
interface CertificationCardProps {
    certification: Certification;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}
```
**Features:** Shows status badge, issuing body, dates, and action buttons.

#### FileUpload
**Purpose:** Drag-and-drop file upload component.
**Props:**
```typescript
interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number; // in MB
    error?: string;
}
```

#### StatCard
**Purpose:** Dashboard metrics display.
**Props:**
```typescript
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    description?: string;
}
```

### 11.2 Layout Components

#### DashboardLayout
**Structure:**
- **Desktop:** Fixed sidebar + scrollable content.
- **Mobile:** Hidden sidebar + bottom navigation.
**Props:** `{ children: React.ReactNode }`

#### AuthLayout
**Structure:** Centered card with back-to-home link and footer.
**Props:** `{ children: React.ReactNode }`

#### AdminLayout
**Structure:**
- **Desktop:** Fixed sidebar.
- **Mobile:** Sheet-based drawer navigation.
**State:** `isSidebarOpen` (client-side state).

### 11.3 UI Components (`src/components/ui`)
All UI components are from **Shadcn UI**, customized with Tailwind:
- **Form Controls:** `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`.
- **Feedback:** `Badge`, `Progress`, `Alert`, `Toast`.
- **Overlays:** `Dialog`, `Sheet`, `Popover`, `AlertDialog`.
- **Data Display:** `Card`, `Table`, `Avatar`, `Separator`.
- **Navigation:** `Tabs`.

---

## 12. Page-by-Page Breakdown

### 12.1 Marketing Pages

#### Homepage (`src/app/(marketing)/page.tsx`)
**Sections:**
1. **Hero:** Headline, subheadline, CTA buttons, waitlist form.
2. **How It Works:** 3-step process with icons.
3. **Features:** Grid of 6 key features.
4. **Social Proof:** Testimonials carousel.
5. **Pricing Preview:** Free vs. Pro comparison.
6. **CTA:** Final conversion section.

**Components Used:** `Badge`, `Button`, `Input`, `Card`.

#### About Page (`src/app/(marketing)/about/page.tsx`)
**Sections:**
1. **Hero:** Mission statement.
2. **Our Story:** Origin narrative with image.
3. **Our Values:** 4 core values in grid.
4. **Meet the Team:** Team member cards.

#### Pricing Page (`src/app/(marketing)/pricing/page.tsx`)
**Layout:** Two-column grid with Free and Verified Pro plans.
**Features:** Feature comparison table, highlighted benefits.

### 12.2 Authentication Pages

#### Login (`src/app/(auth)/login/page.tsx`)
**Form Fields:** Email, Password, Remember Me checkbox.
**Features:** Social login buttons (Google, LinkedIn), "Forgot Password" link.

#### Register (`src/app/(auth)/register/page.tsx`)
**Type:** Multi-step form (3 steps).
**Steps:**
1. Personal Info (Name, Email, Phone, DOB).
2. Password Setup.
3. Professional Info (LinkedIn, Agreement).
**Components:** Custom `StepIndicator`, form validation feedback.

### 12.3 Dashboard Pages

#### Dashboard Overview (`src/app/(dashboard)/dashboard/page.tsx`)
**Cards:**
- Trust Score (circular progress).
- Profile Completion.
- Quick Stats (4 metrics grid).
- Recent Activity timeline.
- Certifications Summary.

#### Certifications List (`src/app/(dashboard)/dashboard/certifications/page.tsx`)
**Features:**
- Filter by status (All, Verified, Pending, Unverified).
- Search bar.
- Grid of `CertificationCard` components.
**Actions:** View, Edit, Delete per card.

#### Add Certification (`src/app/(dashboard)/dashboard/certifications/add/page.tsx`)
**Form Fields:**
- Certification Type (Select with categorized options).
- Issuing Organization.
- Credential ID.
- Issue/Expiry Dates.
- Document Upload (FileUpload component).
**Banner:** Upsell for bundle purchases.

#### Profile Page (`src/app/(dashboard)/dashboard/profile/page.tsx`)
**Tabs:**
1. **Basic Info:** Personal details form.
2. **Experience:** Add/Edit work history.
3. **Education:** Add/Edit degrees.
4. **Skills:** Multi-select skill tags.
**Side Panel:** Live profile preview.

#### Billing (`src/app/(dashboard)/dashboard/billing/page.tsx`)
**Sections:**
- Current Plan card.
- Plan toggle (Free/Pro demo).
- Billing History table (with horizontal scroll on mobile).

#### Settings (`src/app/(dashboard)/dashboard/settings/page.tsx`)
**Tabs:**
1. **Account:** Email, phone, password change.
2. **Privacy:** Public profile toggle, visibility settings.
3. **Notifications:** Email/SMS preferences.
4. **Security:** 2FA, sessions, account deletion.

### 12.4 Admin Pages

#### Admin Dashboard (`src/app/(admin)/admin/page.tsx`)
**Widgets:**
- Key Metrics (4 stat cards).
- Pending Verifications list (urgent items highlighted).
- Verification Status pie chart (Recharts).
- Quick Actions buttons.
- Activity Log timeline.

#### Users Table (`src/app/(admin)/admin/users/page.tsx`)
**Features:**
- Search and filter controls.
- Sortable table columns.
- Pagination.
- Actions: View, Edit, Suspend per user.

#### Verifications Queue (`src/app/(admin)/admin/verifications/page.tsx`)
**Table Columns:** User, Certification, Status, Waiting Time, Actions.
**Filters:** Status, Priority, Date range.

#### Verification Details (`src/app/(admin)/admin/verifications/[id]/page.tsx`)
**Layout (Mobile-Responsive):**
- **Left:** Document viewer with zoom/rotate controls, OCR results.
- **Right:** User info, certification details, checklist, notes, audit trail.
**Actions:** Request Info, Reject, Approve.

---

## 13. State Management

### 13.1 Client-Side State
- **Form State:** React `useState` for controlled inputs.
- **UI State:** Modal visibility, tab selection, mobile nav toggles.
- **No Global State:** Currently no Redux/Zustand; state is local to components or passed via props.

### 13.2 Future Considerations
- For real backend integration, consider:
  - **TanStack Query (React Query)** for server state caching.
  - **Zustand** for global client state (user session, notifications).

---

## 14. Routing Strategy

### 14.1 Route Groups
Next.js 14 App Router uses **route groups** (folders in parentheses) to organize routes without affecting URLs:
- `(marketing)` → Public pages with marketing layout.
- `(auth)` → Authentication pages with `AuthLayout`.
- `(dashboard)` → User dashboard with `DashboardLayout`.
- `(admin)` → Admin panel with `AdminLayout`.
- `(public)` → Public profile pages.

### 14.2 Dynamic Routes
- `/p/[username]` → Public user profile.
- `/admin/verifications/[id]` → Verification detail page.

---

## 15. Accessibility & Best Practices

### 15.1 Semantic HTML
- Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`.
- Form labels properly associated with inputs.

### 15.2 Keyboard Navigation
- All interactive elements are keyboard-accessible (Shadcn UI ensures this).
- Focus states are visible (Tailwind ring utilities).

### 15.3 ARIA Labels
- Icon-only buttons have `aria-label` attributes.
- Status badges use appropriate roles.

### 15.4 Responsive Images
- `alt` attributes on all images.
- Placeholder images use descriptive text.

---

## 16. Future Integration Points

### 16.1 Backend API
Recommended structure for API routes:
```
/api/auth/* → Authentication endpoints
/api/users/* → User management
/api/certifications/* → Certification CRUD
/api/verifications/* → Verification workflow
/api/payments/* → Transaction processing
/api/admin/* → Admin operations
```

### 16.2 Authentication
Suggested providers:
- **NextAuth.js** for authentication.
- **JWT** for session management.
- **OAuth** for social login integration.

### 16.3 Payment Gateway
- **Paystack** (Nigerian payment gateway).
- Integration points already defined in mock data (`paystackReference`).

### 16.4 File Storage
- **AWS S3** or **Cloudinary** for certificate document uploads.
- Pre-signed URLs for secure downloads.

### 16.5 OCR Service
- **Google Cloud Vision** or **AWS Textract** for certificate text extraction.
- Mock OCR data already present in Admin verification flow.

---

## 17. Code Quality & Standards

### 17.1 TypeScript
- **Strict Mode:** Enabled in `tsconfig.json`.
- **Type Safety:** All components and functions are typed.
- **No `any`:** Avoid implicit any types.

### 17.2 Component Standards
- **Functional Components:** All components use React function syntax.
- **Props Interfaces:** Exported for reusability.
- **JSDoc Comments:** Critical components have documentation.

### 17.3 File Naming
- **Pages:** `page.tsx` (Next.js convention).
- **Components:** PascalCase (e.g., `TrustScoreBadge.tsx`).
- **Utilities:** camelCase (e.g., `utils.ts`).

### 17.4 Linting
- **ESLint:** Configured with Next.js recommended rules.
- Run `npm run lint` to check for issues.

---

## 18. Performance Optimizations

### 18.1 Code Splitting
- **Automatic:** Next.js automatically code-splits each route.
- **Dynamic Imports:** Can be used for heavy components (charts, etc.).

### 18.2 Image Optimization
- Use `next/image` for optimized image loading (not yet implemented for placeholder images).

### 18.3 Font Loading
- **Variable Fonts:** Plus Jakarta Sans loaded via `next/font` for optimal performance.

### 18.4 Bundle Size
- **Tree Shaking:** Unused Shadcn components are not included in build.
- **Tailwind Purging:** Unused CSS classes are removed in production.

---

## 19. Testing Strategy (Recommended)

### 19.1 Unit Tests
- **Tool:** Jest + React Testing Library.
- **Focus:** Utility functions, shared components.

### 19.2 Integration Tests
- **Tool:** Playwright or Cypress.
- **Focus:** User flows (registration, certification upload, verification process).

### 19.3 Visual Regression
- **Tool:** Chromatic or Percy.
- **Focus:** Component library, critical user interfaces.

---

## 20. Deployment

### 20.1 Recommended Platform
- **Vercel:** Optimized for Next.js.
- **Environment Variables:** Set via Vercel dashboard.

### 20.2 Build Process
```bash
npm run build   # Creates optimized production build
npm run start   # Starts production server
```

### 20.3 Environment Variables
Define in `.env.local` (not committed):
```
NEXT_PUBLIC_APP_URL=https://chaincred.ng
PAYSTACK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
```

---

## 21. Contributing Guidelines

### 21.1 Git Workflow
- **Branches:** `main` (production), `develop` (staging), `feature/*` (features).
- **Commits:** Conventional commits format (`feat:`, `fix:`, `docs:`).

### 21.2 Pull Requests
- Require code review.
- Must pass linting and build checks.
- Update documentation for new features.

---

## 22. Appendix: Quick Reference

### File Locations
- **Types:** `src/types/index.ts`
- **Mock Data:** `src/data/mock-data.ts`
- **Utils:** `src/lib/utils.ts`
- **Global Styles:** `src/app/globals.css`
- **Tailwind Config:** `tailwind.config.ts`
- **Environment:** `.env.example`

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint code
```

### Important Links
- **Shadcn UI Docs:** https://ui.shadcn.com
- **Tailwind Docs:** https://tailwindcss.com
- **Next.js Docs:** https://nextjs.org/docs

