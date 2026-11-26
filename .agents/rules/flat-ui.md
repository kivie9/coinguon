---
trigger: always_on
description: "Enforces Flat UI, minimal borders, tonal surface hierarchy, elder-friendly readability, and strict anti-AI-slop design standards across all UI work in the giapha project."
---

# Gia Phả Số — Flat UI & Anti-AI-Slop Design Rules

Apply these design rules unconditionally whenever creating, editing, or reviewing UI components, layouts, and pages in this repository (both `(app)` public/member views and `(admin)` CMS views).

## 1. Flat Surface Hierarchy & Minimal Borders (Tonal Architecture)

- **Separate by surface tone and whitespace, NOT borders**: Use the semantic surface tokens already defined in `src/app/globals.css`:
  - Page canvas: `bg-surface` (`#fbf9f5` light / `#1b1c1a` dark)
  - Secondary grouping / recessed bands: `bg-surface-container-low` (`#f5f3ef`) or `bg-surface-container` (`#efeeea`)
  - Primary content cards / panels: `bg-surface-container-lowest` (`#ffffff`)
- **Ban nested bordered boxes ("box-inside-box")**: NEVER wrap bordered sub-containers inside a bordered `Card`, and NEVER combine outer card border + `CardHeader border-b` + inner bordered callout + `CardFooter border-t`.
- **Where `1px` borders ARE permitted**:
  1. Interactive form controls (`Input`, `Select`, `Textarea`) so elderly users clearly see input boundaries (`border-outline-variant/60`).
  2. Data tables (`Table`) and subtle list row dividers (`divide-y divide-outline-variant/25`) where alignment requires hairlines.
- **Never use decorative thick borders** (`border-2`, `gold-border`, glowing ring borders) on cards or badges.

## 2. 100% Solid Flat Colors — Zero Gradients, Glows, or Heavy Shadows

- **Strictly forbidden**:
  - Gradients of any kind: `bg-gradient-to-*`, `bg-radial`, `from-*`, `via-*`, `to-*`, `gold-gradient-btn`, `gold-emboss`.
  - Decorative blur / glow blobs: `blur-xl`, `blur-2xl`, `blur-3xl`, floating translucent circles, or `backdrop-blur-*` on content cards.
  - Heavy elevation or bouncy hover lifts: `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `hover:-translate-y-*`, `hover:scale-*` on cards.
- **Solid semantic palette everywhere**:
  - Primary action / brand emphasis: solid `bg-primary text-on-primary` (`#5b030d`), hover `hover:bg-primary-container`.
  - Secondary accent: solid `bg-secondary text-on-secondary` (`#775a19`) or muted tonal `bg-secondary/12 text-secondary`.
  - Neutral / secondary actions: flat tonal `bg-surface-container text-on-surface hover:bg-surface-container-high` without borders.
  - Unify Admin (`src/components/admin/*`, `src/app/(admin)/*`) with the same warm heritage tokens; do not introduce random `purple-*`, `orange-*`, or off-brand neon accents.
- **Deterministic transitions**: Use crisp `transition-colors duration-150` for interactive states.

## 3. Anti-AI-Slop Blacklist

1. **No `<Sparkles />` icons** anywhere in headers, heroes, badges, or buttons.
2. **No decorative background SVG patterns/rings** or floating "eyebrow glow pills" above headings.
3. **No decorative emojis** (`👑`, `🛡️`, `⚔️`, `👤`, `★`, `✨`) in `<select>` options, table cells, badges, or headings. Use clean text or restrained `lucide-react` icons only where they aid comprehension.
4. **No badge/pill spam**: Show at most **1** meaningful status indicator per card or row (e.g., living/deceased or role). Express generation, dates, and metadata via clean typographic hierarchy rather than wrapping every field in a pill.
5. **Restrained border radius**: Stick to `rounded-lg` (controls/buttons), `rounded-xl` (cards/inputs), and `rounded-2xl` max (modals/hero containers). Avoid `rounded-3xl` / `rounded-4xl` bloat.

## 4. Typography, Primitives & Elder-Friendly Readability

- **Font pairing**:
  - `font-serif` (`Noto Serif`): Page titles, section headings, and ancestor/member names (`text-balance`).
  - `font-sans` (`Be Vietnam Pro`): Navigation, form labels, metadata, tables, and body paragraphs (`text-pretty`).
  - Apply `tabular-nums` to all counts, generation numbers, solar/lunar dates, and fund currency amounts.
- **Legible sizing & contrast for older adults**:
  - Avoid micro-text (`text-[9px]`, `text-[10px]`, `text-[11px]`). Use `text-xs` (`12px`) strictly as the floor for secondary captions, `text-sm` (`14px`)–`text-base` (`16px`) for content, and clear contrast (`text-on-surface` / `text-on-surface-variant`).
  - Ensure primary touch targets are comfortable (`min-h-10` to `min-h-11`), use `size-*` for square avatars/icons, `h-dvh` instead of `h-screen`, and always set `aria-label` on icon-only buttons.
  - Reuse existing `@base-ui/react` + `shadcn/ui` primitives in `src/components/ui/` without mixing competing primitive libraries.

## 5. Installed Workspace UI Skills Integration

- Read and apply `.agents/skills/baseline-ui/SKILL.md` whenever building new UI components or running a deslop/polish pass.
- Read and apply `.agents/skills/improve-ui/SKILL.md` when redesigning an existing screen layout.
- Read and apply `.agents/skills/web-design-guidelines/SKILL.md` (bundled with `references/command.md`) and `.agents/skills/fixing-accessibility/SKILL.md` when auditing UI quality and accessibility.
