# PSP Platform Component Documentation

This document provides comprehensive documentation for all UI components in the PSP platform.

## Design Tokens

### Animation Easing Functions

The following easing functions are used throughout the application for consistent animation behavior:

```css
/* ease-in-out: Standard easing for most animations */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* ease-out: Faster at the beginning, slower at the end - used for entrances */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* ease-in: Slower at the beginning, faster at the end - used for exits */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* ease-linear: No easing, constant speed */
--ease-linear: linear;
```

### Animation Duration Tokens

```css
/* Fast animations for micro-interactions (100-150ms) */
--duration-fast: 100ms;

/* Base animations for standard transitions (150-200ms) */
--duration-base: 150ms;

/* Slow animations for page transitions and large changes (200-300ms) */
--duration-slow: 200ms;
```

### Animations Respecting `prefers-reduced-motion`

All animations should respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

The following components automatically respect this preference:
- All Toast notifications
- Modal/Dialog animations
- Page transitions
- Hover state animations (disabled when reduced-motion is preferred)

---

## Button Component

**Location**: `src/components/ui/Button.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost"` | `"primary"` | Button style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `children` | `React.ReactNode` | - | Button content |
| `className` | `string` | `""` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable the button |
| `onClick` | `(event: React.MouseEvent) => void` | - | Click handler |

### Variants

```tsx
// Primary (PSP Gold) - Use for main actions
<Button variant="primary">Click me</Button>

// Secondary (PSP Navy) - Use for secondary actions
<Button variant="secondary">Secondary Action</Button>

// Outline - Use for tertiary actions
<Button variant="outline">Outlined</Button>

// Ghost - Use for minimal/text actions
<Button variant="ghost">Ghost Button</Button>
```

### Sizes

```tsx
// Small - 12px text, 12px padding
<Button size="sm">Small</Button>

// Medium (default) - 14px text, 16px padding
<Button size="md">Medium</Button>

// Large - 16px text, 20px padding
<Button size="lg">Large</Button>
```

### Usage Examples

```tsx
import Button from '@/components/ui/Button';

export function MyComponent() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Save Changes</Button>
      <Button variant="secondary" onClick={handleClick}>Delete</Button>
      <Button variant="outline">Learn More</Button>
      <Button variant="ghost">Cancel</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

---

## Badge Component

**Location**: `src/components/ui/Badge.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info" \| "sport"` | `"default"` | Badge color variant |
| `children` | `React.ReactNode` | - | Badge content |
| `className` | `string` | `""` | Additional CSS classes |

### Variants

```tsx
// Default - Gray background
<Badge>Default</Badge>

// Success - Green background
<Badge variant="success">Success</Badge>

// Warning - Yellow background
<Badge variant="warning">Warning</Badge>

// Error - Red background
<Badge variant="error">Error</Badge>

// Info - Blue background
<Badge variant="info">Info</Badge>

// Sport - PSP Gold background (for sport-specific content)
<Badge variant="sport">Football</Badge>
```

### Usage Examples

```tsx
import Badge from '@/components/ui/Badge';

export function PlayerCard() {
  return (
    <div>
      <h2>John Smith</h2>
      <Badge variant="success">Active</Badge>
      <Badge variant="sport">Football</Badge>
      <Badge variant="info">2024 Season</Badge>
    </div>
  );
}
```

---

## Card Component

**Location**: `src/components/ui/Card.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Card content |
| `className` | `string` | `""` | Additional CSS classes |

### Compound Component Pattern

```tsx
<Card>
  <Card.Header>Card Title</Card.Header>
  <Card.Body>Card content goes here</Card.Body>
  <Card.Footer>Footer content</Card.Footer>
</Card>
```

### Usage Examples

```tsx
import { Card } from '@/components/ui/Card';

export function TeamStats() {
  return (
    <Card>
      <Card.Header>Team Statistics</Card.Header>
      <Card.Body>
        <div className="grid grid-cols-2 gap-4">
          <div>Wins: 10</div>
          <div>Losses: 2</div>
        </div>
      </Card.Body>
      <Card.Footer>
        <p className="text-sm text-gray-500">Updated today</p>
      </Card.Footer>
    </Card>
  );
}
```

---

## Toast Component

**Location**: `src/components/ui/Toast.tsx`

### Toast Types

- `success` - Green toast for successful operations
- `error` - Red toast for errors
- `info` - Blue toast for information
- `warning` - Yellow toast for warnings

### Usage via Hook

```tsx
import { useToast } from '@/hooks/useToast';

export function MyComponent() {
  const { success, error, info, warning } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      success('Data saved successfully!');
    } catch (err) {
      error('Failed to save data');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Usage via Event Bus

```tsx
import { useToastEvents } from '@/hooks/useEventBus';

export function MyComponent() {
  const toast = useToastEvents();

  const handleAction = () => {
    toast.success('Action completed!', 3000);
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

---

## SortableTable Component

**Location**: `src/components/ui/SortableTable.tsx`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `Array<{ key: string; label: string; sortable?: boolean }>` | Table column definitions |
| `data` | `Array<Record<string, any>>` | Table data rows |
| `onSort` | `(column: string, direction: 'asc' \| 'desc') => void` | Sort callback |

### Usage Example

```tsx
import { SortableTable } from '@/components/ui/SortableTable';

export function PlayersTable() {
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const columns = [
    { key: 'name', label: 'Player Name', sortable: true },
    { key: 'points', label: 'Points', sortable: true },
    { key: 'team', label: 'Team', sortable: false },
  ];

  const players = [
    { name: 'John Smith', points: 1250, team: 'Football' },
    { name: 'Jane Doe', points: 1180, team: 'Basketball' },
  ];

  return (
    <SortableTable
      columns={columns}
      data={players}
      onSort={(col, dir) => {
        setSortCol(col);
        setSortDir(dir);
      }}
    />
  );
}
```

---

## EmptyState Component

**Location**: `src/components/ui/EmptyState.tsx`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `React.ReactNode` | Icon to display |
| `title` | `string` | Empty state title |
| `description` | `string` | Empty state description |
| `action` | `React.ReactNode` | Optional action button |

### Usage Example

```tsx
import { EmptyState } from '@/components/ui/EmptyState';

export function EmptyResults() {
  return (
    <EmptyState
      icon={<SearchIcon />}
      title="No results found"
      description="Try adjusting your search criteria"
      action={<Button>Clear Filters</Button>}
    />
  );
}
```

---

## Skeleton Component

**Location**: `src/components/ui/Skeleton.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `"100%"` | Skeleton width |
| `height` | `string` | `"1rem"` | Skeleton height |
| `className` | `string` | `""` | Additional CSS classes |
| `count` | `number` | `1` | Number of skeleton lines |

### Usage Example

```tsx
import Skeleton from '@/components/ui/Skeleton';

export function PlayerCardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton width="200px" height="1.5rem" />
      <Skeleton width="150px" height="1rem" />
      <Skeleton count={3} height="1rem" className="mt-2" />
    </div>
  );
}
```

---

## StatBlock Component

**Location**: `src/components/ui/StatBlock.tsx`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Statistic label |
| `value` | `string \| number` | Statistic value |
| `icon` | `React.ReactNode` | Optional icon |
| `trend` | `"up" \| "down" \| "neutral"` | Trend indicator |
| `trendValue` | `string` | Trend percentage or value |

### Usage Example

```tsx
import { StatBlock } from '@/components/ui/StatBlock';

export function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatBlock
        label="Total Players"
        value={2450}
        icon={<UsersIcon />}
        trend="up"
        trendValue="12%"
      />
      <StatBlock
        label="Average Score"
        value={87.5}
        trend="up"
        trendValue="5%"
      />
      <StatBlock
        label="Active Teams"
        value={48}
        trend="neutral"
        trendValue="0%"
      />
    </div>
  );
}
```

---

## Breadcrumbs Component

**Location**: `src/components/ui/Breadcrumbs.tsx`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `Array<{ label: string; href?: string }>` | Breadcrumb items |

### Usage Example

```tsx
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function PlayerPage() {
  return (
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Football', href: '/football' },
        { label: 'Players', href: '/football/players' },
        { label: 'John Smith' },
      ]}
    />
  );
}
```

---

## Animation Guidelines

### When to Use Each Easing Function

**ease-out** - Use for entrance animations:
- Modal opens
- Toast appears
- Dropdown expands
- Content fades in

**ease-in** - Use for exit animations:
- Modal closes
- Toast dismisses
- Dropdown collapses
- Content fades out

**ease-in-out** - Use for smooth transitions:
- Hover state changes
- Smooth scrolling
- Page content transitions
- Resize animations

**ease-linear** - Use for continuous animations:
- Loading spinners
- Infinite animations
- Constant speed animations

### Example Animation Definition

```css
.toast-enter {
  animation: slideInTop 300ms var(--ease-out) forwards;
}

@keyframes slideInTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter {
    animation-duration: 1ms;
  }
}
```

---

## Component Variants Matrix

### Button Variant Combinations

| Variant | Size SM | Size MD | Size LG |
|---------|---------|---------|---------|
| Primary | ✓ | ✓ | ✓ |
| Secondary | ✓ | ✓ | ✓ |
| Outline | ✓ | ✓ | ✓ |
| Ghost | ✓ | ✓ | ✓ |

### Badge Variant Coverage

| Sport | Default | Success | Warning | Error | Info |
|-------|---------|---------|---------|-------|------|
| Football | ✓ | ✓ | ✓ | ✓ | ✓ |
| Basketball | ✓ | ✓ | ✓ | ✓ | ✓ |
| Baseball | ✓ | ✓ | ✓ | ✓ | ✓ |
| All Sports | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Accessibility Notes

All components follow WCAG 2.1 AA standards:

- **Button**: Keyboard accessible, proper focus indicators
- **Badge**: Semantic `<span>` with `display: inline-flex`
- **Card**: Semantic `<article>` structure
- **Toast**: ARIA roles for notifications
- **SortableTable**: ARIA-sort attributes for sortable columns
- **Skeleton**: `aria-hidden="true"` since it's a loading placeholder

---

## Performance Considerations

- **Button**: Uses `React.memo` to prevent unnecessary re-renders
- **Badge**: Memoized component for static content
- **Toast**: Uses portals to avoid layout thrashing
- **SortableTable**: Consider virtualization for large datasets (100+ rows)
- **Skeleton**: Lightweight component suitable for loading states

---

## Customization

All components support `className` prop for custom styling via Tailwind CSS:

```tsx
<Button className="rounded-full px-8">Custom Button</Button>

<Badge className="text-lg font-bold">Large Badge</Badge>
```
