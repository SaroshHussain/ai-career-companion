---
name: Cognitive Professional
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#006056'
  on-tertiary: '#ffffff'
  tertiary-container: '#007b6e'
  on-tertiary-container: '#b1fff1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin-mobile: 16px
  container-max: 1200px
---

## Brand & Style
The design system is engineered for a premium AI Career Companion, blending the utility of high-performance developer tools with the approachability of a personal mentor. The aesthetic is **Modern Minimalist**, drawing inspiration from the "utility-luxe" movement seen in industry leaders like Linear and Vercel.

The personality is tech-forward, high-trust, and hyper-efficient. It prioritizes clarity over decoration, using generous whitespace and precise alignment to reduce cognitive load for users navigating complex career decisions. The emotional response should be one of "calm capability"—the feeling that the platform is powerful, intelligent, yet entirely under the user's control.

## Colors
This design system utilizes a high-trust palette rooted in deep blues and vibrant indigos. 

- **Primary (#2563EB):** Used for core actions and brand presence.
- **Secondary (#6366F1):** Used for secondary features and AI-driven highlights.
- **Accent (#14B8A6):** Reserved for "success" states, growth indicators, and career milestones.
- **Surface Strategy:** The background is a cool off-white (`#F8FAFC`), while primary content sits on pure white (`#FFFFFF`) cards to create a subtle layered effect without heavy shadows.
- **Borders:** A consistent, thin `#E2E8F0` border is used to define structure, maintaining a crisp, architectural feel.

## Typography
The system relies exclusively on **Inter** to maintain a systematic, utilitarian aesthetic. The hierarchy is driven by tight letter-spacing on larger headings to give them a "locked-in," professional look.

- **Scale:** A modular scale is used to ensure harmony.
- **Readability:** Body text uses a standard weight (400) with generous line-height (1.5 - 1.6) for long-form career advice and AI feedback.
- **Labels:** Use medium and semi-bold weights to distinguish UI meta-data from content.

## Layout & Spacing
The design system follows a strict **8px grid** (half-step 4px for fine-tuning). 

- **Grid Model:** A 12-column fluid grid is used for desktop (max-width 1200px). 
- **Rhythm:** Spacing between sections should be aggressive (minimum 48px or 64px) to emphasize a premium, uncluttered feel.
- **Mobile Adaptivity:** On mobile, margins shrink to 16px, and multi-column card layouts stack vertically. Gutters remain consistent at 24px to ensure breathing room even on small screens.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Soft Shadows**, mimicking a physical stack of premium paper.

- **Shadow Character:** Use multi-layered, low-opacity shadows. A typical "level 1" shadow consists of a 1px Y-offset with 2% opacity and a 4px Y-offset with 6% opacity, both using a neutral blue-tinted gray (`#0F172A`).
- **Surface Differentiation:** Interactive elements (cards, buttons) use a subtle elevation change on hover—moving from a flat border to a soft shadow—to indicate clickability.
- **Glassmorphism:** Use sparingly for navigation bars or floating action panels, with a `blur(12px)` and `rgba(255, 255, 255, 0.8)` background.

## Shapes
The shape language is defined by **large, friendly radii** that soften the technical nature of AI.

- **Standard Radius:** 0.5rem (8px) for inputs and small components.
- **Large Radius (Container):** 1rem (16px) is the signature radius for cards and main content areas, creating a distinctive, modern silhouette.
- **Pill (Buttons/Chips):** High-action items like primary buttons or status chips may use fully rounded (pill) shapes to draw immediate visual attention.

## Components

### Buttons
- **Primary:** Solid `#2563EB` background with white text. Apply a subtle top-to-bottom gradient (Primary to Primary-Dark) for a tactile feel. 
- **Secondary:** White background with `#E2E8F0` border. Hover state should introduce a very light blue tint (`#EFF6FF`).
- **States:** Hover transitions should be `200ms ease-in-out`. Active states should feature a 2px "ring" focus effect.

### Cards
- **Structure:** White background, 16px rounded corners, and a 1px border (`#E2E8F0`). 
- **Elevation:** Use "Level 1" shadows only on hover to create a "lift" effect.

### Input Fields
- **Style:** Background `#FFFFFF`, 8px radius, 1px border.
- **Focus:** Border transitions to Primary blue with a soft blue outer glow.
- **Labels:** Always positioned above the field in `label-md` style.

### AI Feedback Chips
- **Style:** Small, pill-shaped badges with a light indigo background (`#EEF2FF`) and Indigo text (`#6366F1`) to denote AI-generated insights.

### Progress Indicators
- **Growth Bars:** Thin 4px tracks using Secondary Indigo for current progress and a light gray background for the remainder.