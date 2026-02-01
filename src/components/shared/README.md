# ChainCred Shared Components

A comprehensive library of reusable React components for the ChainCred platform.

## Overview

This library provides 10+ production-ready components designed specifically for the ChainCred professional verification platform. All components are built with TypeScript, follow accessibility best practices, and are fully responsive.

## Components

### 1. TrustScoreBadge

Circular progress ring displaying user trust scores (0-100) with color-coded indicators.

```tsx
import { TrustScoreBadge } from '@/components/shared';

<TrustScoreBadge 
  score={85} 
  size="md" 
  showLabel 
/>
```

**Props:**
- `score` (number): Trust score value 0-100
- `size` ('sm' | 'md' | 'lg'): Visual size
- `showLabel` (boolean): Show "Trust Score" label

**Color Coding:**
- 80-100: Emerald (Excellent)
- 50-79: Blue (Good)
- 0-49: Amber (Fair/Low)

---

### 2. VerificationBadge

Status badge for certifications with icons and tooltips.

```tsx
import { VerificationBadge } from '@/components/shared';

<VerificationBadge status="verified" size="md" />
```

**Props:**
- `status` (VerificationStatus): Current verification status
- `size` ('sm' | 'md'): Badge size

**Status Types:**
- `verified`: Successfully verified
- `pending`: Awaiting verification
- `in_review`: Currently being reviewed
- `failed`: Verification failed
- `expired`: Certificate expired
- `unverified`: Not submitted

---

### 3. CertificationCard

Comprehensive certification display with actions.

```tsx
import { CertificationCard } from '@/components/shared';

<CertificationCard
  certification={certData}
  variant="full"
  onVerify={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
  onView={() => {}}
/>
```

**Props:**
- `certification` (Certification): Certification object
- `variant` ('full' | 'compact'): Display mode
- `onVerify?` (() => void): Verify action callback
- `onEdit?` (() => void): Edit action callback
- `onDelete?` (() => void): Delete action callback
- `onView?` (() => void): View action callback

**Variants:**
- **Full**: Complete details with metadata grid
- **Compact**: Condensed list view

---

### 4. UserAvatar

User avatar with initials fallback and verified ring.

```tsx
import { UserAvatar } from '@/components/shared';

<UserAvatar
  user={{ name: "Emeka Okafor", avatar: "..." }}
  size="md"
  showVerifiedRing
/>
```

**Props:**
- `user` ({ name, avatar? }): User object
- `size` ('xs' | 'sm' | 'md' | 'lg' | 'xl'): Avatar size
- `showVerifiedRing` (boolean): Show blue verified badge

---

### 5. EmptyState

Friendly empty state with icon and CTA.

```tsx
import { EmptyState } from '@/components/shared';

<EmptyState
  icon={FileText}
  title="No certifications yet"
  description="Get started by adding your first certification."
  action={{
    label: "Add Certification",
    onClick: () => {}
  }}
/>
```

**Props:**
- `icon` (LucideIcon): Icon component
- `title` (string): Heading text
- `description` (string): Description text
- `action?` ({ label, onClick }): Optional CTA button

---

### 6. PageHeader

Standardized page header with breadcrumbs and actions.

```tsx
import { PageHeader } from '@/components/shared';

<PageHeader
  title="Dashboard"
  subtitle="Welcome back, Emeka"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Dashboard" }
  ]}
  actions={<Button>Action</Button>}
/>
```

**Props:**
- `title` (string): Main page title
- `subtitle?` (string): Optional description
- `breadcrumbs?` (Array<{ label, href? }>): Navigation breadcrumbs
- `actions?` (ReactNode): Action buttons

---

### 7. StatCard

Dashboard metric card with trend indicators.

```tsx
import { StatCard } from '@/components/shared';

<StatCard
  label="Total Users"
  value="523"
  change={{ value: "+24 this week", type: "positive" }}
  icon={Users}
/>
```

**Props:**
- `label` (string): Metric label
- `value` (string | number): Metric value
- `change?` ({ value, type }): Trend data
- `icon?` (LucideIcon): Optional icon

**Trend Types:**
- `positive`: Green with up arrow
- `negative`: Red with down arrow
- `neutral`: Gray with minus sign

---

### 8. LoadingState

Versatile loading indicators.

```tsx
import { LoadingState } from '@/components/shared';

<LoadingState type="section" message="Loading data..." />
```

**Props:**
- `type` ('page' | 'section' | 'inline'): Loading variant
- `message?` (string): Optional loading message

**Types:**
- **Page**: Full-screen centered spinner
- **Section**: Skeleton content loader
- **Inline**: Inline spinner with text

---

### 9. FileUpload

Drag-and-drop file upload with preview.

```tsx
import { FileUpload } from '@/components/shared';

<FileUpload
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024}
  onUpload={(file) => console.log(file)}
/>
```

**Props:**
- `accept` (string): Accepted file types
- `maxSize` (number): Max size in bytes
- `onUpload` ((file: File) => void): Upload callback
- `preview?` (string): Preview URL
- `isLoading?` (boolean): Loading state

**Features:**
- Drag and drop support
- Click to browse
- Image preview
- File size validation
- Remove/replace option

---

### 10. ConfirmDialog

Accessible confirmation dialog.

```tsx
import { ConfirmDialog } from '@/components/shared';

<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete certification?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  variant="danger"
  onConfirm={() => {}}
/>
```

**Props:**
- `open` (boolean): Dialog state
- `onOpenChange` ((open: boolean) => void): State setter
- `title` (string): Dialog title
- `description` (string): Dialog message
- `confirmLabel?` (string): Confirm button text
- `cancelLabel?` (string): Cancel button text
- `variant` ('danger' | 'warning' | 'default'): Visual style
- `onConfirm` (() => void): Confirm callback
- `onCancel?` (() => void): Cancel callback
- `isLoading?` (boolean): Loading state

**Variants:**
- **danger**: Red (destructive actions)
- **warning**: Amber (warning actions)
- **default**: Blue (standard confirmations)

---

## Usage

### Installing

All components are available through a single import:

```tsx
import { 
  TrustScoreBadge, 
  VerificationBadge,
  CertificationCard,
  // ... other components
} from '@/components/shared';
```

### Types

Import types from the centralized types file:

```tsx
import { Certification, User, VerificationStatus } from '@/types';
```

### Mock Data

Use mock data for development and testing:

```tsx
import { mockUsers, mockCertifications } from '@/data/mock-data';
```

---

## Demo

View all components in action:

```bash
npm run dev
```

Navigate to: [http://localhost:3000/components-showcase](http://localhost:3000/components-showcase)

---

## Design Principles

1. **Consistency**: All components follow the same design language
2. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
3. **Responsiveness**: Mobile-first, adapts to all screen sizes
4. **TypeScript**: Full type safety with comprehensive prop types
5. **Documentation**: JSDoc comments on all components
6. **Nigerian Context**: Mock data uses Nigerian names, companies, and locations

---

## File Structure

```
src/
├── components/
│   └── shared/
│       ├── TrustScoreBadge.tsx
│       ├── VerificationBadge.tsx
│       ├── CertificationCard.tsx
│       ├── UserAvatar.tsx
│       ├── EmptyState.tsx
│       ├── PageHeader.tsx
│       ├── StatCard.tsx
│       ├── LoadingState.tsx
│       ├── FileUpload.tsx
│       ├── ConfirmDialog.tsx
│       └── index.ts
├── types/
│   └── index.ts
├── data/
│   └── mock-data.ts
└── app/
    └── components-showcase/
        └── page.tsx
```

---

## Contributing

When adding new components:

1. Create the component in `src/components/shared/`
2. Add TypeScript props interface with JSDoc comments
3. Export from `src/components/shared/index.ts`
4. Add to showcase page for visual testing
5. Update this README with usage examples

---

## Dependencies

- **UI Framework**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Date Formatting**: date-fns
- **Type Safety**: TypeScript 5+

---

## License

Proprietary - ChainCred Platform
