# MedReco Design System

The design language and component library for **MedReco — Super Admin**, the internal back-office for the MedReco Electronic Medical Records (EMR) platform. It powers the dark, data-dense admin console that System Administrators use to manage clinics, branches, users, patients, roles, imports/exports and audit logs across large healthcare organizations.

> **Product feel:** *Powerful, trustworthy, efficient.* A blend of Linear's calm density, Stripe Dashboard's clarity, and modern healthcare-enterprise software. Productivity over marketing — no hero gradients, no decoration for its own sake.

## Sources

- `assets/medreco-logo-full.png` — original brand lockup (cloud mark + wordmark on white). Provided by the user.
- `assets/medreco-mark.png` — cloud mark cropped + white keyed to transparent for dark surfaces (derived from the logo).
- `assets/reference-users-screen.png` — the reference Users Management screen the UI kit recreates (provided by the user).
- No codebase or Figma file was provided — the system is reconstructed from the brand assets, the reference screenshot, and the written product brief.

---

## Content fundamentals

How MedReco writes copy in the admin console:

- **Voice:** plain, operational, confident. It states what a control does, never sells. "Manage system users, roles, and access across all clinics & branches." not "Effortlessly supercharge your team!"
- **Person:** mostly impersonal / imperative. Buttons are verbs — *Add User, Import CSV, Export Selected, Start Import, Bulk Delete*. Helper text occasionally addresses the admin as "you" ("find what you're looking for"), never "we".
- **Casing:** **Title Case for buttons and nav** (Add User, Roles & Permissions, Import Center). **Sentence case for helper text, descriptions, empty states, table sublabels.** UPPERCASE (tracked +0.08em) only for small section captions and table column headers (MASTER DATA, NAME, STATUS).
- **Numbers:** always grouped with commas and set in tabular/mono figures — `1,248`, `865 / 1,200 records`, `USR-0042781`. Counts lead; units follow ("1,248 users", "12 records failed").
- **Status language:** binary and unambiguous — *Active / Inactive*, *Passed / Warning / Error*, *Online*. Steps are gerund-free labels (Upload, Validate, Preview, Import) but in-progress states use gerunds ("Importing users.csv…").
- **Tone in errors:** factual + actionable, never blaming. "12 records failed — download the error report to review and re-upload."
- **Emoji:** never. **Icons** carry meaning instead (line icons, see Iconography).
- **No exclamation marks** in product UI. No ALL-CAPS shouting beyond captions. No jargon the admin wouldn't use.

Examples of canonical copy: page title **Users Management**; search placeholder *Search by name, email, phone, username...*; empty state *No users found / Try adjusting your search or filters.*; pagination *Showing 1–10 of 1,248 users*.

---

## Visual foundations

**Overall vibe.** Dark-first, near-black canvas with charcoal cards floating a single elevation step above it. Cool, slightly blue-tinted neutrals. Teal is the single hero accent; blue is the secondary. Everything is calm — color is reserved for status, roles, and the one primary action on a screen.

**Color.**
- Backgrounds layer from `--bg-app #0B0F14` (canvas) → `--bg-sidebar #0D1218` → `--surface-card #141A22` (cards) → `--surface-raised #1A212B` (hover/elevated) → `--surface-input/#10161D` (sunken inputs, table header).
- **Teal `#18C7B5`** = primary accent (active nav, focus rings, primary CTA gradient, progress). **Blue `#2D7FF9`** = secondary. **Green `#29D391`** rounds out the brand gradient and reads as success.
- The **brand gradient** is `linear-gradient(135deg, blue → teal → green)` — taken straight from the cloud mark. Used sparingly: avatar fallbacks, the logo "Reco", the primary CTA (teal→green only), progress fills. Never as a full-screen background.
- Status: success green, warning amber `#F5A524`, danger red `#F4475A`, info blue. Each has a translucent soft tint (`--tint-*`) for badges/fills so it sits on any surface.
- Role hues are fixed: Business Owner→amber, Business Director/Doctor→teal/cyan, Manager→violet, Staff→blue.

**Type.** `Geist` for all UI (a modern grotesque — the Linear/Stripe register), `Geist Mono` for IDs, counts, timestamps and any figure that should align. Tight tracking on large text (`-0.02em` on the 32px display / stat numbers), normal on body. Body is 14px; table cells 13–14px; captions 11–12px. Tabular numbers are on globally. *(Substitution note: Geist is loaded from Google Fonts — see Caveats.)*

**Spacing & layout.** 4px base grid. Fixed app chrome: 256px sidebar (72px collapsed), 64px sticky top bar; content scrolls in the remaining area, capped at 1440px with 28px padding. Stat cards in a 4-up grid; filters in a wrapping flex row; the table lives in one bordered card. Generous 20–24px gaps between regions.

**Borders & radius.** Hairline 1px borders everywhere, in three weights (`--border-subtle / default / strong`). Default radius **8px** (`--radius-md`) for cards, inputs, buttons; 12px for large cards/drawers; pills for badges and pagination-adjacent chips. Corners are soft, never sharp, never fully rounded except badges.

**Elevation.** Soft, low-spread shadows tuned for dark (`--shadow-xs…xl`), plus a subtle 1px top inset highlight (`--inset-top`) that gives raised surfaces a faint sheen. Popovers/menus use `--shadow-lg`; the import drawer uses `--shadow-xl`. The primary CTA gets a teal **glow** on hover instead of a heavier shadow.

**Motion.** Quiet and quick. **150ms** is the house transition (`--dur`) on hover/active/sidebar, with an ease-out curve (`cubic-bezier(.22,1,.36,1)`). Sidebar collapse, nav hover, row hover, focus rings all use it. The drawer slides in over 260ms; the bulk toolbar fades/rises 180ms; progress fills animate width + diagonal stripes. No bounce, no infinite decorative loops.

**Interaction states.**
- *Hover:* surfaces lighten one step (e.g. transparent → `--surface-hover`); ghost icons brighten from tertiary → secondary text; nav items lighten **and** grow a thin teal left indicator.
- *Active nav:* teal-tinted background, teal left indicator at full height, white icon + text.
- *Press:* buttons nudge down 0.5px and scale to 0.99 — a small, physical tap.
- *Focus:* teal border + soft teal ring (`--ring-accent`), no browser outline.
- *Selected rows:* teal tint background.

**Transparency & blur.** Used deliberately: the top bar is a translucent sidebar color with `backdrop-filter: blur(8px)`; the drawer scrim is a dark wash with a slight blur; tints are all rgba so color reads against any layer. Otherwise surfaces are solid.

**Imagery.** This is a data tool — there is almost no photography. The only "image" is the colorful cloud mark. Avatars are either photos (circular, 1px border) or deterministic gradient initials. Visual interest comes from typography, color-coded status, and the gradient mark — not illustration.

---

## Iconography

- **System:** [Lucide](https://lucide.dev) line icons — 24px grid, ~1.8px stroke, round caps/joins, currentColor. They match the reference screen's thin, friendly outline style exactly.
- In this project the kit ships a **local hand-built Lucide-style set** in `ui_kits/medreco-admin/icons.jsx` (`window.MedIcons`) so the UI kit renders offline with no CDN dependency. When building new MedReco surfaces, either reuse that set or pull the matching icon from Lucide (`lucide` / `lucide-react`) — keep the 1.8px stroke and round joins.
- **Usage:** icons are monochrome and inherit text color (tertiary by default, brightening on hover; teal when active). Icon chips on stat cards / drawers use a soft tint background + accent-colored icon. Sizes: 15–16px inline in tables/buttons, 18px in nav/topbar, 20–24px in headers/empty states.
- **No emoji, ever.** No multicolor icons except the brand cloud mark. Status is shown with a small colored dot + label, not an emoji.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link (`@import`s only).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `base.css`.
- `assets/` — `medreco-mark.png` (transparent cloud), `medreco-logo-full.png`, `reference-users-screen.png`.
- `readme.md` — this guide. `SKILL.md` — Agent-Skill wrapper.

**Foundation cards** (`guidelines/`, shown in the Design System tab)
- Colors: Brand Accents, Surfaces & Borders, Status Semantics, Role Hues
- Type: Display & Headings, Body & UI Text, Mono & Numerics
- Spacing: Spacing Scale, Radii, Elevation
- Brand: Logo & Mark

**Components** (`components/`, bundled to `window.MedRecoDesignSystem_22e123`)
- `forms/` — **Button, IconButton, Input, Select, Checkbox**
- `data-display/` — **Badge** (status + role), **Avatar**, **StatCard**
- `feedback/` — **ProgressBar**
- Each has `<Name>.jsx` + `.d.ts` + `.prompt.md`; one `*.card.html` per group renders in the tab.

**UI kit** (`ui_kits/medreco-admin/`)
- `index.html` — the interactive **Super Admin** app: collapsible sidebar, top bar, **Users Management** screen (stats, search + filters, enterprise table with sorting, multi-select, sticky bulk toolbar, pagination, empty state) and a 5-step **Import drawer** with live progress. Other nav destinations render a consistent placeholder.
- Composed from: `Sidebar.jsx`, `Topbar.jsx`, `UsersScreen.jsx`, `ImportDrawer.jsx`, `icons.jsx`, `data.js`.

---

## Caveats

- **Font substitution:** the brand's exact UI typeface wasn't supplied. I'm using **Geist** (UI) + **Geist Mono** (numerals) from Google Fonts as a close match to the reference's clean grotesque. Swap in the licensed font files if MedReco has one and I'll wire up `@font-face`.
- No codebase/Figma was provided, so component internals are faithful *recreations* of the reference screen, not copies of production code.
