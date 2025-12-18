# EduFund Style Guide

## Design Principles
- **Bright & Trustworthy:** Use ample whitespace, soft shadows, and rounded corners. Avoid harsh borders or pure black backgrounds.
- **Color Palette:**
  - **Primary Blue (`#0f62fe`)**: Main actions, links, brand recognition.
  - **Accent Green (`#00b37e`)**: Success states, progress bars, positive indicators.
  - **Warm Accent (`#ff8a65`)**: Steps, notifications, human touch.
  - **Background (`#f6f9fc`)**: Main page background to reduce eye strain compared to pure white.
- **Typography:** Inter font family. High contrast for headings, softer gray for body text to improve readability.

## Component Patterns
- **Cards:** White background, `rounded-xl`, `shadow-sm` by default. `hover:shadow-lg` and `hover:-translate-y-1` for interactive cards.
- **Buttons:** 
  - Primary: Full rounded or large radius (10-12px), bold text.
  - Secondary: Outline or ghost style with primary color text.
- **Forms:** Input fields with `rounded-lg`, gray border, and primary color focus ring.

## Accessibility
- Ensure all text has sufficient contrast (AA standard).
- Focus states must be visible (`ring-2 ring-primary`).
- Interactive elements are large enough for touch targets.