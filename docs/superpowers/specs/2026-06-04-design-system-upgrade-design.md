# Design System Upgrade

## Purpose

Upgrade the HumouR mock frontend so it feels like a polished, actively operated hiring SaaS product. The dashboard should become the highest-impact screen, while every page should inherit the same visual language, motion behavior, and responsive structure.

The selected direction is "impact plus system expansion": borrow the reference image's bright blue navigation, soft white surfaces, calm depth, and summary-panel composition, then adapt them to a recruitment workflow rather than copying the medical dashboard literally.

## Scope

This design targets the current React/Vite frontend:

- Common shell: `AppShell`, `SidebarNav`, `TopHeader`
- Shared UI layer: cards, metrics, tables, tags, forms, buttons, alerts, chat surfaces
- Dashboard: hero insight panel, metrics, applicant table, analysis summary, task list
- Secondary pages: company profile, JD management, cover-letter flows, chat, my page, recruitment post preview, cover-letter template

Out of scope:

- API behavior changes
- Authentication logic changes
- New backend data models
- New third-party UI dependencies unless the existing Ant Design stack cannot cover the interaction

## Visual Language

The product should look bright, precise, and operational.

- Primary color remains blue, but shifts from heavy navy dominance to layered blues: vivid navigation blue, pale blue panels, white surfaces, and subtle lavender background fields.
- Accent color remains teal, used sparingly for positive states and secondary highlights.
- Cards keep professional 8px to 18px radii depending on context. Repeated data cards and compact panels should stay tighter than decorative hero areas.
- Shadows should be softer and deeper than the current flat cards, with clear hover states on interactive cards.
- The app background should use soft abstract layer shapes through CSS pseudo-elements or layout backgrounds, not discrete decorative blobs.
- Typography should stay compact and readable for an operations tool. No viewport-based font scaling.

## Dashboard Design

The dashboard becomes the showcase screen.

1. Top area:
   - Replace the plain page title-only opening with a dashboard hero panel.
   - Hero contains the page title, a short operational summary, primary actions, and a visual recruitment/AI analysis illustration made with CSS/HTML shapes or existing iconography.
   - Include a right-side compact summary rail on desktop: credit usage, candidate pipeline count, and analysis completion ratio.

2. Metrics:
   - Metric cards receive icon chips, animated count/entrance feel, clearer change pills, and stable card heights.
   - Layout is four columns on wide desktop, two on tablet, one on mobile.

3. Applicant and analysis sections:
   - Applicant table should feel denser and cleaner: softer row hover, stronger progress styling, consistent tag spacing.
   - Analysis panel should feel like a summary module, with donut chart framing and insight rows that match the new icon/tone system.

4. Task list:
   - Task items should use consistent status affordances and gentle hover movement.

## Common Layout

1. Sidebar:
   - Keep the current left navigation, but make it closer to the reference: brighter blue, stronger active pill, white logo area, clearer icon chips, and a lower credit module.
   - Use smooth hover/active transitions.
   - Keep current Ant Design responsive collapse behavior, but polish the mobile replacement.

2. Header:
   - Add a search affordance on desktop so the app feels operational.
   - Keep notifications, theme switch, and logout actions.
   - Use a translucent/sticky surface with blur and subtle border.
   - On mobile, keep the route select and compact icon actions without text overflow.

3. Content:
   - Use a constrained max content width on very wide screens while keeping dashboards spacious.
   - Add page-level entrance animation so route changes feel intentional.
   - Avoid nested cards inside cards; page sections should be full-width layouts or single framed tools.

## Secondary Page Treatment

Each non-dashboard page should receive the same system polish rather than a bespoke redesign.

- Page titles become refined top sections with clear action placement.
- Forms gain better grouping, compact helper text, and consistent field spacing.
- Lists and preview panels gain the same card, border, and hover language.
- Chat gains a more product-like transcript surface with stronger assistant/user distinction, without oversized decorative treatment.
- My page and company pages should feel like settings/profile modules in a real SaaS admin product.

## Motion

Motion should make the product feel alive without distracting users.

- Use CSS transitions and keyframes only; no new animation library.
- Add subtle page entrance: opacity plus small vertical movement.
- Add card hover elevation and slight translate for clickable surfaces.
- Add button press/hover transitions.
- Add progress reveal for progress bars where feasible through CSS.
- Respect `prefers-reduced-motion: reduce` by disabling entrance movement and long transitions.

## Responsive Behavior

Target responsive tiers:

- Wide desktop: sidebar, sticky header, dashboard hero with right summary rail, four metric columns.
- Laptop/tablet: two-column metric grid, dashboard sections stacked more conservatively, summary rail moves below hero content.
- Mobile: sidebar hidden, route select visible, single-column content, compact actions, tables remain horizontally scrollable or use existing mobile-friendly alternatives where already present.

Text must not overflow controls. Buttons with long Korean labels should wrap through Ant Design `Space` or collapse to icon-only where the existing pattern supports it.

## Data Flow

No data contract changes are required.

- Dashboard continues receiving `DashboardData`.
- Shared components continue consuming existing adapter types.
- Visual-only derived values, such as dashboard hero summaries, can be calculated in the component from existing metrics and analysis summary fields.
- Theme mode continues flowing from the existing app state and CSS custom properties.

## Error Handling

This is primarily a presentation upgrade, so behavior errors are limited.

- Preserve existing alert behavior for refresh, navigation, and not-yet-connected detail actions.
- Ensure loading and empty states remain readable against the new background.
- Avoid animation states that hide content if CSS fails.
- Keep dark theme legible, even if the new reference-inspired design is optimized for light mode.

## Implementation Units

1. Theme and shared CSS tokens:
   - Refine CSS variables for light and dark themes.
   - Add shell background layers, motion variables, reduced-motion rules, card/table/button polish.

2. Layout components:
   - Update sidebar, header, credit summary, and shell content behavior.

3. Dashboard components:
   - Add a dashboard hero component.
   - Refine metric cards, applicant table, analysis panel, and task list styling.

4. Secondary pages:
   - Apply shared page-title and section styling.
   - Adjust page-specific class names only when needed for visual consistency.

5. Verification:
   - Run lint/build.
   - Start the local Vite app.
   - Use browser screenshots at desktop, tablet, and mobile widths.
   - Check that content renders, no major overlap occurs, animations are subtle, and mobile controls remain usable.

## Success Criteria

- Dashboard immediately communicates a high-quality SaaS product, not a plain mockup.
- All pages share the same visual system.
- The app remains operational and scannable, not a marketing landing page.
- Animations are present but restrained and disabled for reduced-motion users.
- Desktop and mobile layouts are visually coherent.
- Existing mock data flows and navigation behavior continue to work.
