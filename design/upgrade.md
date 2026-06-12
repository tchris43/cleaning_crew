# Clean Crew Website Modernization Spec

## Goal

Transform the current website from a functional booking site into a modern, trustworthy local-service website that feels comparable to professionally built sites from Framer, Webflow, Squarespace, or agency templates.

The focus is **clarity, trust, visual polish, and conversions**, not flashy animations.

---

# Design Principles

## Keep

- Existing branding
- Existing booking flow
- Existing pricing structure
- Simple navigation
- Mobile-first approach

## Improve

- Visual hierarchy
- Whitespace
- Professional typography
- Trust-building
- Service presentation
- Before/after showcase

## Avoid

- Excessive animations
- Parallax effects
- Fake testimonials
- Stock imagery
- Marketing jargon
- Complex navigation

---

# Layout Structure

## Hero Section

### Current State

Simple headline and booking CTA.

### Upgrade

Two-column desktop layout.

#### Left Side

**Headline**

> Professional Car Detailing That Makes Your Vehicle Feel New Again

**Subheadline**

> Interior, exterior, and full-detail packages throughout Utah County.

**CTA Row**

- Book Appointment
- View Services

**Trust Row**

- Mobile Service Available
- Satisfaction Focused
- Fully Equipped

#### Right Side

Featured vehicle image or before/after showcase.

---

## Before & After Section

Move near top of page.

This should appear before detailed service descriptions.

### Layout

**Section Title**

> See the Difference

**Grid**

```text
Before → After
Before → After
Before → After
```

Desktop:
- 3 columns

Tablet:
- 2 columns

Mobile:
- 1 column

### Goal

Show results before asking visitors to read.

---

## Services Section

### Replace Current Service Cards

Use consistent card design.

Each card contains:

- Icon
- Service Name
- Short Description
- Starting Price
- Learn More CTA

### Card Styling

```css
border-radius: 8px;
padding: 24px;
background: white;
border: 1px solid #e5e7eb;
```

#### Hover

```css
transform: translateY(-2px);
transition: 200ms ease;
```

---

## Vehicle Size Guide

Present as cleaner visual cards.

Example:

```text
Compact
Sedan
SUV
Truck
Large SUV
```

Each with:

- Simple silhouette image
- Description
- Pricing adjustment

---

## Booking Section

Keep existing booking functionality.

Improve visual presentation.

### Add

Short reassurance text:

> Booking takes less than two minutes.

Display:

- Service selected
- Vehicle size
- Estimated price
- Appointment time

before final submission.

---

## Trust Section

Add below services.

### Include

```text
✓ Professional Equipment

✓ Attention to Detail

✓ Convenient Scheduling

✓ Friendly Service
```

Avoid exaggerated claims.

---

## FAQ Section

Add near bottom.

### How long does detailing take?

Answer with typical range.

### Do you come to me?

Answer based on business model.

### What payment methods do you accept?

Answer accordingly.

### What should I do before my appointment?

Provide simple guidance.

---

# Visual Design System

## Content Width

Global container:

```css
max-width: 1200px;
margin: 0 auto;
padding-left: 24px;
padding-right: 24px;
```

Text blocks:

```css
max-width: 650px;
```

---

## Section Spacing

### Desktop

```css
padding-top: 80px;
padding-bottom: 80px;
```

### Mobile

```css
padding-top: 56px;
padding-bottom: 56px;
```

---

## Typography

### Hero

```css
font-size: 56px;
font-weight: 700;
line-height: 1.1;
```

### Section Titles

```css
font-size: 36px;
font-weight: 700;
```

### Card Titles

```css
font-size: 20px;
font-weight: 600;
```

### Body Text

```css
font-size: 16px;
line-height: 1.6;
```

---

## Background Rhythm

Alternate sections.

Pattern:

```text
White
Light Gray/Blue
White
Light Gray/Blue
White
```

Example colors:

```css
#ffffff
#f8fafc
```

---

## Buttons

### Primary

```css
height: 48px;
padding: 0 24px;
border-radius: 8px;
font-weight: 600;
```

#### Hover

```css
transform: translateY(-1px);
```

---

## Cards

Standard card styling:

```css
border-radius: 8px;
border: 1px solid #e5e7eb;
padding: 24px;
background: white;
```

### Shadow

```css
box-shadow: 0 1px 3px rgba(0,0,0,.08);
```

Very subtle only.

---

# Microinteractions

Add only:

### Buttons

- Hover state
- Focus state

### Cards

- Slight lift

### Sections

- Fade in once when scrolled into view

### Navigation

- Smooth scrolling

No large animations.

---

# Mobile Requirements

### Ensure

- Booking CTA visible above fold
- Hero text remains readable
- Before/after gallery stacks properly
- Service cards become single column
- No horizontal scrolling

---

# Conversion Improvements

## Sticky Mobile CTA

Optional:

```text
Book Appointment
```

Fixed to bottom of screen on mobile.

---

## Service Comparison

Allow users to quickly compare:

```text
Interior Detail
Exterior Detail
Full Detail
```

without scrolling between sections.

---

# Success Criteria

The website should feel:

- Professional
- Trustworthy
- Easy to scan
- Mobile-friendly
- Focused on booking
- Comparable to a polished Framer/Webflow service-business template

The visitor should be able to answer these questions within 10 seconds:

1. What does this company do?
2. Is their work good?
3. What services are offered?
4. How much does it roughly cost?
5. How do I book?

---

# Priority Order

## Phase 1 (Highest Impact)

1. Improve hero section
2. Add before/after gallery
3. Improve typography
4. Increase whitespace
5. Improve service cards

## Phase 2

1. Add trust section
2. Add FAQ section
3. Improve vehicle size guide
4. Add subtle animations

## Phase 3

1. Sticky mobile CTA
2. Service comparison section
3. Additional conversion optimizations
4. Further visual refinements