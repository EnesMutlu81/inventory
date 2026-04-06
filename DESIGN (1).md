# Design System Document: The Precision Architect

## 1. Overview & Creative North Star
The "Precision Architect" is the Creative North Star for this design system. In a world of cluttered, line-heavy data tables, we choose a path of **Atmospheric Professionalism**. This system rejects the "spreadsheet" aesthetic in favor of a high-end editorial experience that prioritizes data density without sacrificing soul. 

We break the "template" look by moving away from rigid grids and 1px borders. Instead, we use **Tonal Layering** and **Intentional Asymmetry**. By utilizing subtle background shifts and sophisticated typography scales, we create a sense of organized calm. The interface doesn't just display data; it curates it, guiding the eye through a rhythmic flow of information where the space between elements is as important as the elements themselves.

---

## 2. Colors & Surface Philosophy
Our palette is a sophisticated interplay of deep architectural blues (`primary`) and cool, slate-tinted grays (`secondary`). 

### The "No-Line" Rule
Explicitly prohibit the use of 1px solid borders for sectioning or row separation. Boundaries are defined solely through background shifts.
- **Example:** A `surface-container-low` list item sitting on a `surface` background provides all the definition needed. If you feel the need to draw a line, instead adjust the background token of the nested element.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Each "inner" container should move up or down the tier scale to define its importance.
- **Base Layer:** `surface` (#f8f9fa)
- **Content Sections:** `surface-container-low` (#f1f4f6)
- **Interactive Cards/Active Items:** `surface-container-lowest` (#ffffff) for a "pop" effect.
- **Secondary Sidebars/Nav:** `surface-container` (#eaeff1)

### The "Glass & Gradient" Rule
To elevate the CRUD experience from "utility" to "premium," use Glassmorphism for floating elements (like Modals or Popovers). 
- Use semi-transparent `surface` colors with a `backdrop-blur` of 12px–20px. 
- **Signature Textures:** Apply a subtle linear gradient from `primary` (#005db5) to `primary_dim` (#0052a0) on main Action Buttons to give them a tactile, machined quality.

---

## 3. Typography
We utilize a dual-sans-serif approach to balance authority with utility.

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "editorial" feel. Use `display-md` for page headers to create a bold, high-contrast entry point.
- **Body & UI Labels (Inter):** The workhorse for data. Inter’s high x-height ensures that even at `body-sm` (0.75rem), data remains hyper-legible.
- **The Hierarchy:** 
    - **Title-lg:** Use for list item headers.
    - **Label-md:** Use for table headers, transformed to uppercase with 0.05em letter spacing for a professional, "architectural" look.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "lift" that feels integrated into the architecture of the page.
- **Ambient Shadows:** For floating menus (Create/Edit modals), use a "Ghost Shadow": `box-shadow: 0 12px 40px rgba(43, 52, 55, 0.06)`. This mimics soft, ambient light rather than a harsh digital shadow.
- **The "Ghost Border" Fallback:** If accessibility requirements demand a container boundary, use the `outline_variant` (#abb3b7) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_dim`), `on_primary` text. Border radius: `md` (0.375rem).
- **Secondary:** `secondary_container` fill with `on_secondary_container` text. No border.
- **Tertiary:** Ghost style. `on_surface_variant` text, shifting to `surface_container_high` on hover.

### CRUD Lists & Cards
- **The Grid:** Forbid divider lines between rows. Use a 12px vertical gap between list items.
- **States:** An "Active" or "Selected" row should shift to `primary_container` (#d6e3ff) with a 4px `primary` accent bar on the left edge.
- **Data Density:** Use `body-md` for primary data and `label-md` (muted with `on_surface_variant`) for metadata.

### Input Fields
- **Surface:** Use `surface_container_highest` for the input track. 
- **Active State:** Instead of a thick border, use a 2px `primary` bottom-border only, or a subtle `primary_fixed_dim` glow.
- **Validation:** Error states use `error` (#9f403d) for text and `error_container` for a subtle background wash.

### Chips (Status Indicators)
- Use "Tonal Chips": A background of `secondary_fixed_dim` with text in `on_secondary_fixed`. This creates a high-end, low-vibrancy look that doesn't distract from the primary data.

---

## 6. Do's and Don'ts

### Do
- **Do** use whitespace as a separator. If information feels cluttered, increase the padding (using the 4px/8px scale) rather than adding a line.
- **Do** use `on_surface_variant` for secondary info to create a clear visual hierarchy.
- **Do** ensure all interactive elements have a minimum 44px hit-zone, even if the visual element is smaller.

### Don't
- **Don't** use pure black (#000). Use `on_background` (#2b3437) for all primary text to maintain a premium, "ink-on-paper" feel.
- **Don't** use standard 1px borders. They create visual noise and make the application look like a legacy tool.
- **Don't** use "Drop Shadows" with high opacity. If it looks like a shadow, it’s too dark. It should look like a "glow" or "depth."