# Clean Crew Detailing - Intent Specification (MVP)

## Purpose

The website exists primarily to convert interested prospects into booked detailing appointments.

Most visitors will arrive from:

* Group text messages
* Referrals
* Door-to-door interactions
* Flyers

The primary goal is to allow users to book an appointment with as little friction as possible.

---

# Success Metrics

Primary Success Metric:

* Completed bookings

Target:

* Approximately 20 bookings per week

Secondary Metrics:

* Users understand pricing
* Users understand service tiers
* Users can successfully book without assistance

---

# MVP Scope

Included:

* Service information
* Pricing information
* Before/After gallery
* Appointment booking
* Appointment storage
* Basic validation and error handling

Not Included:

* Customer accounts
* Authentication
* Online payments
* Google Calendar integration
* SMS automation
* Self-service rescheduling
* Dynamic scheduling calculations

---

# User Flow

1. User opens website
2. User immediately sees booking section
3. User selects service tier
4. User enters vehicle make/model
5. User sees applicable pricing
6. User selects appointment date
7. User selects appointment time
8. User enters contact information
9. User agrees or declines photo permission
10. User submits booking
11. User sees success screen

Supporting content below booking:

* Before/After photos
* Service descriptions
* Vehicle size guide
* FAQ

---

# Booking Fields

Required:

* Full Name
* Phone Number OR Email Address
* Service Tier
* Vehicle Make
* Vehicle Model
* Appointment Date
* Appointment Time
* Photo Permission Response

Optional:

* Notes

---

# Photo Permission

Required response.

Customer must explicitly choose:

YES:
"I allow Clean Crew Detailing to use before and after photos of my vehicle for marketing purposes."

NO:
"I do not allow before and after photos of my vehicle to be used for marketing purposes."

---

# Scheduling Rules

Time slots are hard-coded.

No dynamic availability calculations.

Capacity:

* Maximum 3 bookings per time slot

Booking Window:

* Earliest booking date: next available Monday
* Latest booking date: 60 days from current date

Business Hours:

* Monday–Saturday: 9:00 AM–12:00 PM
* Tuesday & Thursday: 12:00 PM–4:00 PM
* Monday & Wednesday: 6:00 PM–9:00 PM

---

# Vehicle Classification

Customers provide:

* Vehicle Make
* Vehicle Model

Clean Crew determines:

* Small
* Mid-Size
* Large

using the existing vehicle size guide.

---

# Discount

Display banner:

"First 20 Customers Receive a Special Discount"

Discount tracking is manual.

No automated enforcement.

---

# Success Criteria

Given all required fields are valid

When the user submits a booking

Then:

1. Booking is saved
2. Capacity rules are enforced
3. Success screen is shown
4. Booking details are available to Clean Crew

---

# Error Handling

## Missing Contact Information

Given neither phone nor email is provided

When booking is submitted

Then:
Show validation error

"Please provide a phone number or email address."

---

## Missing Required Fields

Given a required field is empty

When booking is submitted

Then:
Show field-level validation errors

Do not submit booking.

---

## Invalid Email

Given email format is invalid

When booking is submitted

Then:
Show validation error.

---

## Invalid Phone Number

Given phone number format is invalid

When booking is submitted

Then:
Show validation error.

---

## Duplicate Button Clicks

Given user clicks submit multiple times

When booking is processing

Then:
Disable submit button

Display:
"Booking..."

Only one booking attempt may be processed.

---

## Page Refresh

Given booking was successfully created

When page refreshes

Then:
No duplicate booking is created.

---

## Browser Back Button

Given booking already succeeded

When user returns to form

Then:
No duplicate booking is created.

---

## Network Failure

Given the request cannot reach the server

When booking is submitted

Then:
Show error:

"We couldn't confirm your booking. Please try again."

No success screen shown.

---

## Server Timeout

Given booking request exceeds timeout threshold

When booking is submitted

Then:
Show generic booking failure message.

Do not assume success.

---

## Database Failure

Given database write fails

When booking is submitted

Then:
Show error message

Do not show success screen.

---

## Partial Failure

Given booking saves successfully

But notification process fails

Then:
Booking remains valid

Success screen still shown

Failure logged internally.

---

## Slot Capacity Reached

Given 3 bookings already exist for a slot

When another booking is attempted

Then:
Reject booking

Show:

"This appointment time is no longer available."

---

## Concurrent Booking Race Condition

Given multiple users attempt to book the final available slot simultaneously

When capacity would be exceeded

Then:
Only valid bookings up to capacity are saved

Remaining users receive slot unavailable error.

---

# Success Screen

Title:
"Appointment Booked"

Display:

* Date
* Time
* Service Tier
* Vehicle

Message:

"We've received your appointment information. If we need additional information we will contact you using the phone number or email provided."
