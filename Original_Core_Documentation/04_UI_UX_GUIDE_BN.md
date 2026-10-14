# 04 — UI/UX Design System: Liquid Glass

## 1. Design direction
Create a premium, calm, trustworthy financial dashboard—not a decorative concept that reduces legibility. Use layered translucent surfaces, subtle blur, thin borders, restrained gradients, generous spacing and clear data hierarchy. Keep important tables and totals opaque enough to read.

## 2. Theme modes
Provide:
- Appearance: System / Day / Night
- Accent presets: Blue, Red, Green, Purple, Yellow/Amber, Teal, Rose, Orange
- Density: Comfortable / Compact
- Optional reduced motion
The requested “five modes” can be interpreted as Day/Night plus color presets. Do not create a separate unrelated layout for every color; keep the same semantic tokens and swap the accent palette.

## 3. Token model
Use semantic tokens rather than hard-coded colors inside components:
```css
:root {
  --background: 248 250 252;
  --surface: 255 255 255;
  --surface-glass: 255 255 255 / 0.72;
  --foreground: 15 23 42;
  --muted: 100 116 139;
  --border: 148 163 184 / 0.25;
  --primary: 37 99 235;
  --success: 22 163 74;
  --warning: 217 119 6;
  --danger: 220 38 38;
}
[data-theme="night"] {
  --background: 8 15 30;
  --surface: 15 23 42;
  --surface-glass: 15 23 42 / 0.72;
  --foreground: 241 245 249;
  --muted: 148 163 184;
  --border: 148 163 184 / 0.22;
}
```
These are illustrative starting tokens. Validate contrast for every palette, especially yellow/white text combinations. Persist user preference in profile or local storage; local storage is a preference store only, never a security boundary.

## 4. Glass surface guidelines
- Use `backdrop-filter: blur(12–24px)` sparingly.
- Add solid/near-solid fallback where backdrop filters are unsupported.
- Use 1px translucent borders and soft shadows; avoid stacking too many blurred layers.
- For financial tables, forms and dialogs, prioritize opaque surfaces and contrast over glass effect.
- Avoid excessive animation and parallax; respect `prefers-reduced-motion`.
- Ensure keyboard focus indicators, semantic HTML, accessible labels and screen-reader text.
- On mobile, support safe areas, large tap targets (about 44px), scrollable tables/cards and bottom navigation.

## 5. Dashboard information hierarchy
Top row:
- Current month selector
- Active members
- Total meals
- Current meal rate (show “pending” if not calculable)
- Total eligible expenses
- Outstanding/credit summary

Main areas:
- Meal trend chart
- Market schedule today/next 7 days
- Recent deposits and expenses
- Members with missing meal entries (only if tracking is expected)
- Quick actions: Add meal, Add expense, Add deposit, Assign market duty

## 6. Essential screens
- Login / reset password / onboarding
- Dashboard
- Members table + search/filter + member detail
- Meal calendar and bulk-entry grid
- Market schedule calendar/list + reassign/swap controls
- Expenses and deposits
- Monthly settlement preview and close
- Reports: whole mess and individual member
- Settings: mess profile, roles, theme, data/privacy
- Audit log for owner/manager

## 7. Responsive behavior
Desktop: sidebar + top bar + content canvas. Tablet: collapsible sidebar. Mobile web: bottom nav or compact drawer. Never require horizontal scrolling for critical actions; use cards or responsive table transformations.

## 8. Report UI
A report preview must be a dedicated clean template, not a screenshot of the entire dashboard. Include mess name, report title, date range, generated timestamp, summary metrics, detailed rows, totals, currency and pagination/footnotes. Hide interactive controls from exports.

## 9. Theme acceptance criteria
- [ ] Every page supports Day and Night.
- [ ] All accent presets preserve readable status colors.
- [ ] Theme preference persists and initializes without obvious flash where practical.
- [ ] Focus, hover, disabled, error and selected states are defined.
- [ ] Liquid surfaces fall back gracefully on low-performance devices.
- [ ] Charts and exported reports remain legible regardless of app theme.
