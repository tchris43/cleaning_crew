# Clean Crew Detailing MVP - UI Specification v2

## Design Goal

The website should feel like:

* A professional local detailing company
* A digital version of the Clean Crew flyer
* Trustworthy
* Simple
* Easy to book

The website should **NOT** feel like:

* A SaaS startup
* A tech company
* A dashboard
* A generic AI-generated landing page

---

# Primary Business Goal

The purpose of the website is:

**Book appointments**

Everything else is secondary.

---

# Design Reference

The attached Clean Crew flyer is the primary design reference.

The website should visually resemble the flyer.

Reuse:

* Colors
* Service package structure
* Pricing presentation
* Bubble motif
* Typography style

The flyer should be recognizable as the same brand.

---

# Color Palette

## Primary Navy

```css
#20263F
```

## Gold Accent

```css
#D9A62E
```

## Background

```css
#FFFFFF
```

## Border

```css
#D9D9D9
```

## Text

```css
#20263F
```

Do not introduce additional brand colors.

---

# Overall Layout

The page should be:

```text
HEADER

HERO

SERVICE PACKAGES

BOOKING FORM

VEHICLE SIZE GUIDE

FAQ

CONTACT
```

---

# Header

Contains:

* Clean Crew logo
* Phone number

Phone:

```text
385-685-8941
```

Optional:

```text
Book Appointment
```

button.

No large navigation menu.

---

# Hero Section

Compact.

Not full-screen.

Contains:

* Logo
* Headline
* Subheadline
* Discount banner
* Primary CTA

Headline:

```text
Clean Crew Detailing
```

Subheadline:

```text
Professional Interior Detailing
```

Gold banner:

```text
First 20 Customers Receive a Special Discount
```

Primary button:

```text
Book Appointment
```

Hero should immediately lead into pricing.

No stock images.

---

# Bubble Pattern

Use the bubble motif from the flyer.

Requirements:

* Very subtle
* Low opacity
* Decorative only

Allowed locations:

* Hero background
* Footer background

Do not place bubbles behind form fields.

---

# Service Packages Section

This should be one of the most visually prominent sections.

Display:

* 3 cards side-by-side on desktop
* Stacked on mobile

Cards:

1. Basic Interior Refresh
2. Deep Clean Interior
3. Premium Restoration

---

## Card Styling

Use flyer styling.

Rounded corners:

```css
8px
```

Border:

```css
2px solid #20263F
```

Minimal or no shadow.

---

## Deep Clean Card

Highlight as:

```text
Most Popular
```

using a gold badge.

Should be visually emphasized.

---

## Card Content

Include all flyer content.

Show:

* Description
* Included services
* Small price
* Mid-size price
* Large price

Do not rewrite flyer copy.

Use flyer terminology.

---

# Booking Section

Position directly beneath service packages.

Centered.

Max width:

```css
700px
```

The booking form should feel important.

Avoid tiny side-column forms.

---

## Booking Form Title

```text
Book an Appointment
```

Subtext:

```text
Choose your service, vehicle, and preferred time.
```

---

## Form Fields

Required:

* Service Tier
* Vehicle Make
* Vehicle Model
* Date
* Time
* Phone
* Email
* Photo Permission
* Notes

Business Rule:

At least one of Phone or Email is required.

---

## Time Selection

Do NOT use a dropdown.

Display available times as selectable cards.

Example:

```text
9:00 AM
9:30 AM
10:00 AM
10:30 AM
11:00 AM
```

Selected card should clearly show active state.

Users should never see time block terminology.

Only appointment times.

---

## Submit Button

Large.

Full width.

Color:

```css
#20263F
```

Text:

```text
Book Appointment
```

---

# Vehicle Size Guide

Below booking form.

Use flyer categories.

Accordion is acceptable.

Display:

* Small
* Mid-Sized
* Large

Include vehicle examples from flyer.

---

# FAQ

Simple accordion.

Questions:

* How long does detailing take?
* Where do I bring my vehicle?
* How do I know my vehicle size?
* Can I book multiple vehicles?
* Do you take before and after photos?

Keep answers concise.

---

# Contact

Phone:

```text
385-685-8941
```

Simple.

No maps.

No contact form.

No social media feeds.

---

# Success Modal

Display:

```text
Appointment Booked
```

Show:

* Date
* Time
* Service
* Vehicle

Message:

```text
We've received your appointment information. If we need additional information we will contact you using the phone number or email provided.
```

Primary action:

```text
Close
```

---

# Mobile Design

Mobile experience is priority.

Requirements:

* Large tap targets
* Single-column layout
* Easy date selection
* Easy time selection
* No horizontal scrolling

---

# Visual Style Requirements

The website should feel:

```text
Clean
Professional
Local
Friendly
```

The website should NOT feel:

```text
Luxury
Corporate
Tech startup
```

---

# Explicitly Prohibited

* No dark mode
* No gradients
* No glassmorphism
* No parallax effects
* No autoplay videos
* No stock photos
* No AI-generated vehicle images
* No large drop shadows
* No generic trust badges
* No "Why customers choose us" section
* No marketing statistics
* No fake testimonials
* No countdown timers
* No popup promotions
* No chat widgets
* No carousel sliders
* No startup-style marketing copy
* No large empty whitespace sections

---

# Flyer First Rule

The flyer is the source of truth.

When choosing between:

* Making the site look modern
* Making the site look like the flyer

Choose the flyer.

The website should feel like a digital version of the printed Clean Crew sales material with booking functionality added.

---

# Implementation Guidance

Before writing UI code:

1. Create a wireframe.
2. Explain visual hierarchy.
3. Explain how each section supports booking conversion.
4. Confirm alignment with the flyer.
5. Only then implement the UI.
