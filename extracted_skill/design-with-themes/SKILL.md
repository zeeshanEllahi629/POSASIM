---
name: design-with-themes
description: Create distinctive, production-grade frontend interfaces, static art, and themed visual designs. Use this skill when the user wants to build web components, pages, artifacts, landing pages, dashboards, slide decks, posters, OR static art pieces (PNG/PDF) — especially when they want a consistent color/font theme applied. Triggers include: "website banana", "poster banana", "themed dashboard", "landing page with theme", "styled component", "koi theme lagao", "design karo", "art banana", "poster chahiye", "canvas design", or any request to build AND style a frontend artifact OR create a visual art piece. This skill combines creative design direction with a curated library of 10 professional themes (Ocean Depths, Sunset Boulevard, Forest Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert Rose, Tech Innovation, Botanical Garden, Midnight Galaxy) plus custom theme generation AND canvas-based visual art creation (PNG/PDF output). Use whenever design + theming + art are involved.
---

# Design with Themes Skill

This skill combines **creative frontend design**, **professional theme system**, and **canvas-based visual art creation**. It handles building beautiful interfaces, applying cohesive themes, AND creating museum-quality static art pieces (PNG/PDF).

---

## Workflow

### Step 1 — Design Direction

Before coding, commit to a bold aesthetic direction:

- **Purpose**: What problem does this solve? Who uses it?
- **Tone**: Pick a clear aesthetic — brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial, etc.
- **Differentiation**: What makes this UNFORGETTABLE?

**CRITICAL**: Choose a conceptual direction and execute it with precision. Never converge on generic AI aesthetics (no Inter/Roboto fonts, no purple-on-white gradients, no cookie-cutter layouts).

### Step 2 — Theme Selection

**If the user has not chosen a theme yet:**
1. Show `theme-showcase.pdf` so they can see all 10 themes visually
2. Ask which theme to apply
3. Wait for their selection

**If the user already specified a theme (or wants you to pick one):**
- Read the matching file from `themes/` directory and proceed directly

**If none of the 10 themes fits:**
- Generate a custom theme (see Custom Theme section below)

### Step 3 — Build & Apply

Once design direction and theme are clear:
1. Read the chosen theme file from `themes/`
2. Build the interface with full creative investment
3. Apply theme colors, fonts, and visual identity throughout
4. Ensure proper contrast and readability

---

## Design Principles

### Typography
- Choose fonts that are beautiful, unique, and interesting
- Avoid Arial, Inter, Roboto, system fonts
- Pair a distinctive display font with a refined body font
- Typography should match the aesthetic direction

### Color & Theme
- Use the selected theme's palette via CSS variables for consistency
- Dominant colors with sharp accents outperform timid palettes
- Commit fully — no half-measures

### Motion & Interaction
- Use animations for micro-interactions and page load moments
- CSS-only for HTML artifacts; Motion library for React when available
- One well-orchestrated reveal > many scattered animations

### Spatial Composition
- Unexpected layouts: asymmetry, overlap, diagonal flow, grid-breaking elements
- Generous negative space OR controlled density — pick one

### Backgrounds & Visual Details
- Create atmosphere: gradient meshes, noise textures, geometric patterns
- Layered transparencies, dramatic shadows, decorative borders, grain overlays
- Never default to plain solid backgrounds

---

## Available Themes

10 pre-built themes in `themes/` directory:

| # | Theme | Vibe |
|---|-------|------|
| 1 | **Ocean Depths** | Professional, calming, maritime |
| 2 | **Sunset Boulevard** | Warm, vibrant, energetic |
| 3 | **Forest Canopy** | Natural, grounded, earthy |
| 4 | **Modern Minimalist** | Clean, contemporary, grayscale |
| 5 | **Golden Hour** | Rich, warm, autumnal |
| 6 | **Arctic Frost** | Cool, crisp, winter-inspired |
| 7 | **Desert Rose** | Soft, sophisticated, dusty |
| 8 | **Tech Innovation** | Bold, modern, tech-forward |
| 9 | **Botanical Garden** | Fresh, organic, garden colors |
| 10 | **Midnight Galaxy** | Dramatic, cosmic, deep |

Each theme file contains: color palette with hex codes, font pairings, best use cases.

---

## Custom Theme Generation

When none of the 10 themes fits, create a custom one:

1. Based on user's description, choose appropriate colors and fonts
2. Give the theme a descriptive name (e.g. "Neon Tokyo", "Sahara Dust")
3. Define:
   - Primary background color
   - 2–3 accent colors
   - Text color
   - Header font + Body font
4. Show the theme for review before applying
5. Apply once confirmed

---

## Implementation Notes

- **HTML/CSS/JS artifacts**: Use Google Fonts imports for typography, CSS variables for theming
- **React artifacts**: Import fonts via @import in style tags or inline styles; use Tailwind with custom color values
- **Presentations/Docs**: Apply theme colors to headings, accents, backgrounds; use specified fonts throughout
- Always verify contrast ratios for readability
- Maintain theme identity consistently — headers, buttons, cards, borders should all reflect the chosen palette

---

## Quick Reference — When to Show Theme Picker vs Auto-Select

| Situation | Action |
|-----------|--------|
| User gave no theme preference | Show `theme-showcase.pdf`, ask |
| User said "you pick" or "surprise me" | Pick the best fit for the context, explain why |
| User named a specific theme | Read that theme file, apply directly |
| No theme fits | Generate a custom theme, show for approval |

---

## Canvas Art Creation (PNG / PDF Output)

When the user wants a **poster, static art piece, visual artwork, or design artifact** as a downloadable PNG or PDF file, follow this two-phase process:

### Phase 1 — Design Philosophy

Create a visual philosophy (not a layout or template) — think of it as a manifesto for an art movement. It must emphasize:
- **Form, space, color, composition** as the primary language
- **Minimal text** — text is a visual accent, never paragraphs
- **Expert craftsmanship** — the final work must look meticulously labored over, as if it took countless hours by someone at the top of their field

**Name the movement** (1-2 words): e.g. "Brutalist Joy", "Chromatic Silence", "Metabolic Dreams"

Write 4-6 paragraphs covering:
- Space and form approach
- Color and material language
- Scale and rhythm
- Composition and balance
- Visual hierarchy principles

Output this as a `.md` file alongside the artwork.

**CRITICAL**: Emphasize craftsmanship repeatedly in the philosophy. The final work must appear painstakingly crafted, the product of deep expertise.

### Phase 2 — Canvas Creation

With philosophy established, create the artwork:

1. **Identify the conceptual thread** — a subtle, niche reference embedded in the art. Someone familiar with the subject feels it intuitively; others experience a masterful abstract composition. Like a jazz musician quoting another song.

2. **Execute with mastery**:
   - Use repeating patterns, perfect shapes, systematic visual language
   - Treat design as scientific observation — dense marks, layered patterns that reward sustained viewing
   - Sparse, clinical typography with systematic reference markers
   - Limited, intentional color palette
   - Simple phrases or details positioned subtly
   - **Nothing overlaps. Nothing falls off canvas. Proper margins always.**

3. **Typography**: Use fonts from `./canvas-fonts/` directory. Make typography part of the art itself — bring fonts onto the canvas as visual elements, not just typeset text. Most of the time, use thin fonts.

4. **Final Polish Pass**: After creating, go back and refine. Do NOT add more elements — instead make what exists more cohesive and pristine. Ask: "How can I make what's already here more of a piece of art?"

5. **Output**: Single `.pdf` or `.png` (unless multiple pages requested) + `.md` philosophy file.

### Canvas Font Library

Available in `./canvas-fonts/` directory:
- ArsenalSC, BigShoulders, Boldonse, BricolageGrotesque
- CrimsonPro (Regular, Bold, Italic), DMMono, EricaOne, GeistMono
- And more — always check the directory for available options

### Multi-Page Option

When multiple pages are requested: treat the first page as one page in a coffee table book. Each additional page should be a unique twist on the theme — almost telling a story, tastefully. Exercise full creative freedom across pages.

### When to Use Canvas vs Frontend

| Request type | Approach |
|---|---|
| "Website/app/dashboard banana" | Frontend (HTML/React) + Theme |
| "Poster/art/design banana" | Canvas (PNG/PDF) + Philosophy |
| "Presentation/slides" | Themed document output |
| "Logo/brand identity" | Canvas art approach |
| Both UI and art needed | Do both, clearly labeled |
