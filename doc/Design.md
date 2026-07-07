---
name: Efficient Flow
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 16px
  card-gap: 12px
---

## Brand & Style

The design system is centered on productivity, clarity, and professional reliability. Designed specifically for a task management environment, the visual language prioritizes focus and task completion. 

The style is **Corporate / Modern**, leaning into a clean, refined aesthetic that utilizes heavy whitespace to reduce cognitive load. It employs a card-based architecture to modularize information, ensuring that users can distinguish between different work streams at a glance. The emotional response should be one of "controlled momentum"—the feeling of being organized and in command of one's schedule.

## Colors

The palette is anchored by a high-energy "Productive Blue" (#2563eb) as the primary brand color, used for primary actions and active states. The background uses a soft "Off-White" (#f8fafc) to reduce glare during long periods of use while maintaining a crisp, professional look.

Semantic colors are strictly defined for task status:
- **Success:** Green (#22c55e) for completed tasks.
- **Warning:** Amber (#f59e0b) for pending or at-risk items.
- **Error:** Red (#ef4444) for urgent or overdue deadlines.

Neutrals are pulled from the Slate scale to maintain a cool, modern professional tone rather than a warm, casual one.

## Typography

This design system utilizes **Inter** for its exceptional legibility on digital screens and its neutral, systematic character. Given the Arabic language requirement, the typeface must be implemented with appropriate line-height adjustments to accommodate script descenders and ascenders without clipping.

The hierarchy is built to emphasize task titles:
- **Headlines:** Bold and concise, used for screen titles and task names.
- **Body:** Standardized for descriptions and notes, prioritizing readability.
- **Labels:** Used for metadata (dates, tags, status) in uppercase or semi-bold variants for quick scanning.

Text alignment must follow Right-to-Left (RTL) logic, with primary focus points starting from the top-right.

## Layout & Spacing

The design system follows a **Fluid Grid** model for mobile, utilizing a standard 4-column layout with 16px side margins. The spacing rhythm is based on a 4px baseline grid to ensure mathematical harmony across all components.

- **Vertical Spacing:** 12px (card-gap) between task cards to maintain a tight, organized list view.
- **Padding:** 16px internal padding for cards to provide "breathing room" for text.
- **RTL Reflow:** All layout logic is mirrored. Iconography that denotes direction (arrows, progress bars) must be flipped for the Arabic interface, while icons like "clocks" or "checks" remain static.

## Elevation & Depth

To maintain a modern feel, the design system avoids heavy shadows in favor of **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Base):** Background (#f8fafc).
2.  **Level 1 (Cards):** White surfaces with a 1px border (#e2e8f0) or an extremely soft, diffused shadow (Y: 2px, Blur: 4px, Opacity: 4% Black).
3.  **Level 2 (Active Elements):** Primary buttons or active cards use a slightly more pronounced shadow (Y: 4px, Blur: 10px, Opacity: 8% Blue-Tinted).

Depth is used sparingly to indicate interactable elements versus static background containers.

## Shapes

The shape language is friendly yet professional, utilizing **Rounded (Level 2)** settings. This choice softens the "rigid" corporate nature of a task app, making it more approachable for daily use.

- **Buttons & Cards:** 0.5rem (8px) base radius.
- **Large Containers/Modals:** 1rem (16px) radius for `rounded-lg`.
- **User Avatars:** Circular (pill-shaped) to distinguish human elements from functional task elements.

## Components

### Buttons
- **Primary:** Solid #2563eb with white text. High-contrast, 8px radius.
- **Secondary:** Light blue tint (#eff6ff) with #2563eb text. Used for less urgent actions.

### Task Cards
- **Structure:** Title (Headline-sm) on the right, status icon or checkbox on the left.
- **Metadata:** Due dates and priority tags displayed at the bottom of the card in `label-md`.
- **Admin View Modifier:** Admin-level cards include an "Assignee" avatar in the bottom-left corner and a "Log" icon for history access.

### Chips & Tags
- Used for categories (e.g., "Work," "Personal"). 
- Backgrounds are low-opacity versions of the primary color with centered text.

### Inputs
- **Text Fields:** 1px slate-200 border, turning primary blue on focus. 
- **Checkboxes:** Larger-than-standard hit targets (minimum 44x44px) for mobile accessibility. When checked, the entire card background may transition to a very light green tint.

### User vs. Admin Distinctions
- **User View:** Focuses on personal progress with a "My Day" summary header.
- **Admin View:** Includes a "Team Overview" dashboard, distinct border-left (or border-right in RTL) accents on cards to denote high-priority team tasks, and additional "Edit/Delete" quick-action icons.