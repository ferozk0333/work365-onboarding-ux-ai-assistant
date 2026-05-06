Design System: Work 365 Onboarding — Light Theme
Adapted from Together AI visual language · Last Updated: May 2026

---

1. VISUAL THEME & ATMOSPHERE

Work 365's onboarding interface is a clean, light-only design system — optimistic, airy, and precise. The visual language draws from Together AI's approach: soft pastel bloom gradients in hero sections create warmth and depth without literal meaning, while the rest of the UI stays on a crisp white-and-near-white canvas. The atmosphere is "enterprise tool with genuine taste" — technical and structured, never clinical.

There is no dark mode or dark surface variant. All sections, components, and containers live within the light world. The signature midnight ink (#010120) is reserved exclusively for primary text, the logo mark, and the primary CTA button — it never fills a section background or card surface.

Steel blue (#75A2D1) is the system's accent: it signals active states, progress, AI interaction, and contextual highlights. The softer variant (#B8D4F5) is used for badge/chip fills and the Kick-off Meeting card surface.

Two expressive tinted surfaces — steel blue soft and warm peach — appear in dashboard hero cards to signal distinct action types (scheduled events and session continuity). These are the only colored surfaces in the system and do not extend beyond that use case.

Key Characteristics:
- Pure white (#ffffff) and near-white surfaces (#f6f6fb, #eeeef6) as the base — no dark sections
- Steel blue soft (#B8D4F5) for the Kick-off card and warm peach (#f5d5c0) for the Resume card
- Midnight ink (#010120) for primary text, logo, and primary buttons only
- Steel blue (#75A2D1) as the active/highlight/AI accent throughout
- Sharp 4px border-radius universally — buttons, cards, badges, inputs, everything
- Mono labels (uppercase, positive letter-spacing) as structural signposts
- Dark-blue-tinted shadows only: rgba(1,1,32,0.07–0.09) — never warm or generic black
- Tight negative letter-spacing on all display and heading text


---

2. COLOR PALETTE & ROLES

Primary Text & Brand
  Midnight Ink    #010120     Primary text, logo mark, primary CTA background
  Pure White      #ffffff     Page background, card backgrounds, nav

Surfaces
  Surface         #f6f6fb     Page background, section backgrounds, input fill, left nav
  Surface 2       #eeeef6     Progress bar tracks, done step circles

Expressive Card Surfaces (Dashboard Hero Cards Only)
  Steel Blue Soft  #B8D4F5    Kick-off Meeting card — scheduled/calendar events
  Warm Peach       #f5d5c0    Resume Last Session card — continuity/return actions
  These two colors appear nowhere else in the UI.

Accent — Steel Blue System
  Blue Active      #75A2D1                  Active states, progress fill, AI pulse, highlight strokes
  Blue Soft BG     rgba(184,212,245,0.14)   Badge backgrounds, highlight fills, chip backgrounds
  Blue Mid Border  rgba(184,212,245,0.32)   Badge borders, active ring borders
  Blue Glow        rgba(117,162,209,0.35)   Active step outer glow ring

Text
  Primary          #010120                  Full opacity — headings, body, labels
  Secondary        rgba(1,1,32,0.80)        Supporting text, nav items, descriptions
  Muted            rgba(1,1,32,0.60)        Inactive labels, helper text, mono section labels
  Faint            rgba(1,1,32,0.40)        Disabled states, No Started badge text
  Badge/chip text always uses ink at appropriate opacity — no dedicated accent text color

Semantic Status
  Done Text        #0f6e56                  Completed state text
  Done BG          rgba(15,110,86,0.07)     Done badge background
  Done Border      rgba(15,110,86,0.18)     Done badge border
  Amber Text       #633806                  In-progress state text
  Amber BG         rgba(133,79,11,0.07)     In-progress badge background
  Amber Border     rgba(133,79,11,0.18)     In-progress badge border
  No Started Text  rgba(1,1,32,0.40)        Faint ink
  No Started BG    rgba(1,1,32,0.05)        Near-transparent fill
  No Started Bdr   rgba(1,1,32,0.08)        Default border weight

Borders & Dividers
  Border Faint      rgba(1,1,32,0.10)       Subtle borders, ghost elements
  Border Light      rgba(1,1,32,0.30)       Default card, nav, input borders
  Border Medium     rgba(1,1,32,0.50)       Stronger dividers, button borders, done connector lines
  Section Divider   rgba(1,1,32,0.08)       Row dividers inside cards


---

3. TYPOGRAPHY

Fonts
  Instrument Sans — display and body. Geometric, modern, slightly warm.
  Inconsolata — labels, tags, badges, timestamps only. Never in body or headings.

Hierarchy
  Hero Display       Instrument Sans   28–36px   600   -1.1px       1.06   (36px desktop, 28px tablet)
  Heading 2          Instrument Sans   22px      600   -0.55px      1.1
  Section Heading    Instrument Sans   17px      600   -0.35px      1.2
  Card Title         Instrument Sans   13px      600   -0.15px      1.2
  Body / Nav         Instrument Sans   13–14px   400–500  -0.12px   1.5
  Small Body         Instrument Sans   11–12px   400–500  -0.08px   1.45
  Caption            Instrument Sans   10px      400   -0.04px      1.4
  Mono Label large   Inconsolata       10px      600   +0.07px      1.0
  Mono Label small   Inconsolata       8–9px     600   +0.05–0.06px 1.0
  Mono Micro         Inconsolata       7–8px     400–600  +0.04px   1.0

Principles
- Instrument Sans headings always use negative letter-spacing (-0.3px to -1.1px)
- Inconsolata always uppercase with positive letter-spacing — never in body or headings
- Font weights: 400, 500, 600 only — never 700+
- Line-heights: 1.06–1.2 for headings, 1.45–1.55 for body


---

4. COMPONENT ROLES & PLACEMENT

When to use each component and where it belongs in the layout. Visual specs live in Figma and CSS.
Interactive components (buttons, forms, dropdowns, checkboxes, radio, search) are covered in Section 9.

Universal Rule: 4px border-radius on everything. Avatars only exception (50%).

Badges
  Always inline with content — task rows, stage headers, list items. Never floating.
  One per row maximum. Status badges always on the trailing (right) edge.
  Default       Neutral labels and counts with no status meaning.
  Blue / Active Currently active stage, selected state, or AI-related context.
  Done          Task or stage fully completed.
  In Progress   Task or stage started but not finished.
  No Started    Task or stage not yet touched.

Cards
  Standard      Default container for any grouped content.
  Surface       Secondary or nested content within/below a standard card.
  Kick-off      Exclusively for scheduled meeting or event callouts on the dashboard.
  Resume        Exclusively for session continuity prompts on the dashboard.
  Need Help     Dashboard hero row only, alongside Kick-off and Resume cards.
  Did You Know  Bottom of the left nav sidebar. One per view. Stage-contextual tips.

Navigation — Top Bar
  Always visible on every screen. Logo, app name, Power App link, avatar, Need Help button.
  Never place primary content or stage-specific actions here.

Navigation — Left Sidebar
  Desktop only (full layout). Company/user header, primary nav links, Did You Know card,
  Collapse toggle. Collapses on tablet, hidden on mobile.

Progress Tracker
  Always visible — never hidden behind a toggle.
  Vertical: when left sidebar is present, sits adjacent to it.
  Horizontal: when left nav is collapsed or hidden.
  Mobile: condenses to a pill showing only the current stage label.

Progress Bar
  Dashboard hero: overall onboarding completion.
  Stage rows: task-level progress within an active stage.
  Never decorative — always tied to a real value.

AI Assistant Panel
  Fixed right side on desktop. Always accessible without navigation.
  Suggestion chips surface from current stage context.
  Collapses below main content on tablet and mobile.

Icons
  Microsoft Fluent Icons throughout. Always paired with a label except in the collapsed
  left nav where space is constrained.

Mono Section Labels
  Above section headings only — e.g. "DASHBOARD", "ONBOARDING STAGE", "TASKS".
  One per section block. Never mid-section or as a heading substitute.


---

5. ELEVATION

  Flat (0)       No shadow, no border
  Contained (1)  1px solid rgba(1,1,32,0.08)
  Elevated (2)   rgba(1,1,32,0.07) 0px 2px 8px
  Prominent (3)  rgba(1,1,32,0.09) 0px 4px 14px

All shadows use midnight ink tinting — never warm-toned or generic black.


---

6. LAYOUT

Spacing
  Base unit: 4px
  Scale: 4, 8, 10, 12, 14, 16, 18, 22, 28, 32, 36, 48px
  Section vertical gap: 14–20px
  Viewport padding: 28–32px

Grid
  Max-width: ~1200px, centered
  Desktop (full):     Left nav (220px) + main content (flex) + right AI sidebar (300px)
  Desktop (condensed): Main content (flex) + right AI sidebar (300px)
  Mobile:             Single column stacked
  Column gap: 14px

Whitespace
- Breathing room is structural: generous spacing signals hierarchy
- Cards contain tightly, pages breathe
- Mono labels create visual rhythm as spacing anchors


---

7. HERO BLOOM SYSTEM

Soft blurred radial gradients layered over white. Reserved for full-width landing or intro screens — not the standard dashboard.

Three layers, positioned top-right, blur 55px each, border-radius 50%, pointer-events none:
  Layer 1  rgba(239,44,193,0.07)    Magenta
  Layer 2  rgba(184,212,245,0.18)   Blue soft
  Layer 3  rgba(120,160,255,0.09)   Blue

Exact dimensions and positioning live in CSS.


---

8. RESPONSIVE BEHAVIOR

Breakpoints
  Mobile        < 480px      Single column, left nav hidden
  Large Mobile  480–767px    Single column, condensed top nav
  Tablet        768–991px    Left nav collapses, right sidebar may stack
  Desktop       992px+       Full three-column layout

Collapsing Strategy
- Left nav: collapsible on desktop, hidden on mobile
- Hero title: 36px → 28px → 22px
- Progress tracker: vertical → horizontal → pill
- Right AI sidebar: fixed on desktop, stacks below on tablet/mobile
- Expressive cards: stack vertically on mobile


---

9. COMPONENT STATES

States are defined in Figma and implemented in CSS. This section covers interactive components — their usage context and state vocabulary.

Buttons
  Usage         One primary per page maximum. Secondary paired alongside primary. Small/Ghost
                inside cards for scoped actions. Text Link for tertiary actions where a button
                feels too heavy (e.g. "Explain me", "Resume Last Session").
  Default       Resting state
  Hover         Cursor over element
  Focused       Keyboard focus — visible focus ring
  Disabled      Not available — reduced opacity
  Outlined      Alternative variant — no fill, border only

Form Fields (Text Input, Text Area)
  Usage         On screens requiring input — settings, configuration, invitations.
                Labels always above the field. Group related fields in a standard card.
  Default       Empty, resting
  Focused       Active input — border highlight
  Filled        Has a value entered
  Error         Validation failed — error message below field
  Disabled      Not editable — muted appearance

Dropdown / Select
  Usage         Use when the option set is fixed and known. Always label above.
  Default       Closed, no selection
  Open          Menu expanded, options visible
  Selected      Value chosen, menu closed
  Disabled      Not interactive — muted appearance

Checkbox
  Usage         Use for multi-select or boolean agreement (e.g. Accept terms).
  Unchecked     Default empty state
  Checked       Selected
  Indeterminate Partially selected (e.g. "Select all" with mixed children)
  Disabled      Not interactive

Radio Button
  Usage         Use for mutually exclusive choices (e.g. Monthly / Annual / Custom).
  Unselected    Default
  Selected      Active choice
  Disabled      Not interactive

Search Input
  Usage         Use when filtering a list or finding a specific item within a dataset.
  Default       Empty, resting
  Active        Focused with a query entered
  With Results  Dropdown of matching results visible below


---

10. DOS AND DON'TS

Do:
- Use #f6f6fb and #eeeef6 for all standard surfaces
- Use #010120 only for text, logo, and primary button
- Apply 4px radius universally
- Use #75A2D1 for active states, AI highlights, progress fills
- Use #B8D4F5 only for the Kick-off card
- Use Inconsolata uppercase for all labels and badges
- Apply rgba(1,1,32,…) tinted shadows only
- Use negative letter-spacing on all Instrument Sans headings
- Allow occasional creative exceptions — the system is a guide, not a cage

Don't:
- No dark surfaces or backgrounds
- No pill-shaped corners — 4px only
- Don't extend #B8D4F5 or #f5d5c0 beyond their designated cards
- No warm-toned shadows
- No font weight above 600
- No positive letter-spacing on Instrument Sans
- No Inconsolata in body copy or headings
- No additional typefaces beyond Instrument Sans + Inconsolata
