---
name: TenantVerdict
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c6c6cb'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#909095'
  outline-variant: '#45474b'
  surface-tint: '#c6c6cc'
  primary: '#c6c6cc'
  on-primary: '#2f3035'
  primary-container: '#0a0c10'
  on-primary-container: '#797a7f'
  inverse-primary: '#5d5e63'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#4ce337'
  on-tertiary: '#023900'
  tertiary-container: '#001000'
  on-tertiary-container: '#0c8e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e8'
  primary-fixed-dim: '#c6c6cc'
  on-primary-fixed: '#1a1c20'
  on-primary-fixed-variant: '#45474b'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#78ff5e'
  tertiary-fixed-dim: '#4ce337'
  on-tertiary-fixed: '#012200'
  on-tertiary-fixed-variant: '#045300'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The brand personality of the design system centers on "Digital Justice"—an intersection of historical legal authority and forward-leaning technological precision. The target audience includes property owners, tenants, and legal professionals seeking a decentralized alternative to traditional litigation. 

The aesthetic is a hybrid of **Minimalism** and **Glassmorphism**, tempered by a "Courtroom Gravitas." It utilizes expansive dark space (Charcoal) to evoke the weight of a courtroom, contrasted against the ethereal, glowing edges of AI-driven interfaces. The emotional response should be one of confidence, transparency, and clinical efficiency. Every interaction should feel like a formal proceeding, yet remain friction-less through modern UI patterns.

## Colors

This design system uses a dark-mode-first approach to emphasize the premium, high-stakes nature of legal tech.

- **Primary (#0A0C10):** Used for all foundational surfaces and backgrounds. It provides the "void" upon which all evidence and data are presented.
- **Accent - Verdict Gold (#D4AF37):** Reserved for high-priority CTA buttons, final judgments, and primary branding. It represents the "gavel" or the finality of a decision.
- **Secondary Accent - Logic Teal (#20C20E):** Used specifically for AI processing states, live data feeds, and successful transaction confirmations. It distinguishes automated logic from human-led legal status.
- **Text & Contrast:** Off-white (#F5F5F5) is used for primary body text. For monetary values and data points, use pure white (#FFFFFF) with increased font weight to ensure maximum legibility against the dark backdrop.

## Typography

The typography strategy leverages the contrast between the old world and the new. 

- **Headlines:** Use **Playfair Display** for all primary headings. This evokes the feeling of a printed legal charter or a physical law library.
- **Body:** Use **Inter** for general reading and form inputs. It provides the necessary clarity for long-form legal text and tenant agreements.
- **Technical Data:** Use **Geist** (a technical, developer-friendly sans) for hash addresses, monetary figures, and AI reasoning logs to signal the underlying blockchain/AI infrastructure.
- **Scale:** Maintain generous line-heights for body text to ensure readability of complex legal jargon.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Rhythm:** An 8px linear scale governs all padding and margins.
- **Content Density:** The layout should feel "airy" despite the dark color palette. Use wide margins (64px+) on desktop to center the "Evidence" or "Case Files" as the primary focus.
- **Adaptation:** On mobile, margins reduce to 16px, and multi-column data tables should collapse into "Evidence Cards" to maintain legibility.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layering**. 

1.  **Background (Level 0):** Pure Charcoal (#0A0C10).
2.  **Cards (Level 1):** Surfaces use a semi-transparent fill (e.g., #FFFFFF at 3-5% opacity) with a `backdrop-filter: blur(12px)`.
3.  **Borders:** Rather than heavy shadows, elements are defined by thin 1px "glowing" borders. For active AI elements, use a 1px Logic Teal border. For static cards, use a 1px border at 10% white opacity.
4.  **Shadows:** When necessary, use extremely diffused, large-radius shadows (e.g., `box-shadow: 0 20px 40px rgba(0,0,0,0.5)`) to lift primary action modals or final verdict documents above the main UI.

## Shapes

The shape language is **Soft (0.25rem)**. 

While the app is modern, high roundedness (pill shapes) feels too casual for a legal setting. A subtle radius on buttons and cards ensures the UI feels contemporary without losing the structural rigidity associated with institutional law. Buttons should be rectangular with the Soft radius, never fully rounded.

## Components

- **Buttons:** 
    - *Primary:* Verdict Gold (#D4AF37) background with black text. Sharp, professional, authoritative.
    - *Secondary:* Transparent with a Logic Teal (#20C20E) border. Used for AI-related actions.
- **Data Tables:** High-contrast borders. Use `data-mono` typography for currency and transaction IDs. Header rows should be in `label-caps` for a disciplined, organized feel.
- **Cards:** Use the glassmorphism style defined in Elevation. Apply a subtle "Justice Scale" watermark motif (low opacity) in the top-right corner of official Verdict cards.
- **Multi-step Progress Indicators:** Vertical "Timeline" style for desktop, horizontal for mobile. Use a thin, glowing Logic Teal line to connect steps, signifying the "Chain of Evidence."
- **Input Fields:** Bottom-border only or very subtle 1px outline. Focus state should trigger a Verdict Gold glow.
- **AI Reasoning Feed:** A monospaced sidebar or component that streams the AI's logic steps using Logic Teal text, providing transparency into the dispute resolution process.