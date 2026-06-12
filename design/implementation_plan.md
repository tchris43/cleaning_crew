# Clean Crew Detailing MVP - Implementation Plan

## Version

v1.1

## Objective

Implement a reliable appointment booking website that:

* Maximizes bookings
* Prevents lost appointments
* Prevents duplicate appointments
* Prevents overbooking
* Supports manual operations
* Requires minimal maintenance

---

# Tech Stack

Frontend:

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

Forms:

* React Hook Form
* Zod

Backend:

* Next.js Route Handlers

Database:

* Supabase Postgres
* Supabase JavaScript Client

Email:

* Resend

Hosting:

* Vercel

Testing:

* Vitest
* React Testing Library
* Playwright

---

# Repository Structure

/app
page.tsx

/api
/appointments
route.ts

/components
booking-form.tsx
time-slot-picker.tsx
pricing-card.tsx
success-modal.tsx
before-after-gallery.tsx

/lib
validation.ts
slots.ts
email.ts
supabase.ts

/types
appointment.ts

/tests
/unit
/integration
/e2e

---

# Database Design

Table:
appointments

Columns:

id

* UUID
* Primary Key

created_at

* Timestamp
* Default now()

name

* Text
* Required

phone

* Text
* Nullable

email

* Text
* Nullable

service_tier

* Enum
* Required

vehicle_make

* Text
* Required

vehicle_model

* Text
* Required

appointment_date

* Date
* Required

appointment_time

* Time
* Required

time_block

* Enum
* Required

block_capacity_snapshot

* Integer
* Default 3

photo_permission

* Boolean
* Required

notes

* Text
* Nullable

status

* Text
* Required
* Default "booked"

Allowed status values:

* booked
* completed
* cancelled

---

# Service Tier Enum

BASIC_REFRESH

DEEP_CLEAN

PREMIUM_RESTORE

---

# Time Block Enum

MORNING

AFTERNOON

EVENING

---

# Database Constraints

Business Rule:

At least one contact method is required.

phone IS NOT NULL
OR
email IS NOT NULL

Enforced by:

1. Zod validation
2. API validation

Capacity Rule:

Maximum 3 bookings

Per:

* appointment_date
* time_block

---

# Slot Configuration

Hard-coded.

lib/slots.ts

Example:

Morning:

* 9:00
* 9:30
* 10:00
* 10:30
* 11:00

Afternoon:

* 12:00
* 12:30
* 1:00
* 1:30
* 2:00
* 2:30
* 3:00

Evening:

* 6:00
* 6:30
* 7:00
* 7:30
* 8:00

Customer sees:

* Date
* Time

System stores:

* appointment_date
* appointment_time
* time_block

Capacity is enforced against the entire block.

---

# Booking Creation Strategy

Capacity enforcement must occur inside the database.

A Supabase/Postgres RPC function shall be created:

create_appointment(...)

Responsibilities:

1. Validate block capacity
2. Insert appointment
3. Return success/failure

All capacity checks and inserts must occur within a single database transaction.

Application code must never perform:

count -> insert

as separate operations.

Application code should only call:

create_appointment(...)

and process the result.

---

# TDD Implementation Order

Phase 1 must be completed before any UI work.

1. Write integration tests for booking creation and capacity enforcement.
2. Add the database schema for appointments.
3. Implement the create_appointment RPC function.
4. Make the booking creation and slot-capacity tests pass.
5. Refactor only after the tests are green.
6. Start UI implementation only after capacity enforcement and booking creation are verified.

Required test-first outcomes:

* Booking creation succeeds for valid requests
* Slot full requests return BLOCK_FULL
* Concurrent requests never exceed capacity
* Duplicate booking attempts do not create duplicate rows

---

# Concurrency Requirement

Given multiple users attempt to book simultaneously,

When requests target the same:

* appointment_date
* time_block

Then:

* Maximum 3 bookings may exist.
* Capacity must never be exceeded.
* Excess requests must receive BLOCK_FULL.

This guarantee must hold under concurrent requests.

---

# API Contract

POST /api/appointments

Request:

{
"name": "",
"phone": "",
"email": "",
"serviceTier": "",
"vehicleMake": "",
"vehicleModel": "",
"appointmentDate": "",
"appointmentTime": "",
"photoPermission": true,
"notes": ""
}

Success:

200

{
"success": true,
"appointmentId": ""
}

Validation Failure:

400

{
"success": false,
"code": "VALIDATION_ERROR"
}

Slot Full:

409

{
"success": false,
"code": "BLOCK_FULL"
}

Server Error:

500

{
"success": false,
"code": "SERVER_ERROR"
}

---

# Booking Flow

1. Select Tier
2. Enter Vehicle Make
3. Enter Vehicle Model
4. Select Date
5. Select Time
6. Enter Contact Information
7. Select Photo Permission
8. Submit
9. Success Modal

---

# Validation Layer

Required:

* Name
* Tier
* Vehicle Make
* Vehicle Model
* Date
* Time
* Photo Permission

Business Rule:

Phone OR Email required

Phone:

* US phone format

Email:

* Standard email validation

Notes:

* Maximum 500 characters

---

# Duplicate Submission Protection

Frontend:

Submit button disabled after click.

Button text:

Booking...

Backend:

Request processed exactly once.

Success page refresh must not create duplicate bookings.

Browser back button must not create duplicate bookings.

---

# Email Notifications

Provider:

Resend

Owner Notification:

Required

Contents:

* Name
* Phone
* Email
* Tier
* Vehicle
* Date
* Time
* Photo Permission
* Notes

Destination:

OWNER_NOTIFICATION_EMAIL

Customer Notification:

Optional

Send only when email exists.

Customer email failures must never invalidate a booking.

---

# Success Flow

Show modal.

Display:

* Date
* Time
* Tier
* Vehicle Make
* Vehicle Model

Message:

"We've received your appointment information. If we need additional information we will contact you using the phone number or email provided."

---

# Error Handling

Validation Error

Message:

Please check that all required fields are completed.

Network Failure

Message:

Failed to connect. Please try again.

Timeout

Message:

Request timed out. Refresh and try again.

Block Full

Message:

This appointment block is already full.

Database Failure

Message:

Something went wrong. Please try again.

Unknown Error

Message:

Something went wrong. Please try again.

---

# Logging

Log to:

* console.error()
* Vercel Logs
* Supabase Logs

Log:

* Validation failures
* API failures
* Database failures
* Email failures

---

# CSV Export

MVP:

Use Supabase dashboard export.

No custom admin export page.

---

# Test Strategy

Development Method:

Test Driven Development

Workflow:

1. Write failing test
2. Implement feature
3. Make test pass
4. Refactor

Implementation sequencing:

1. Database schema
2. RPC function
3. Integration tests for booking creation and capacity
4. UI only after core booking tests pass

---

# Unit Tests

Missing Contact

Expect:

Validation Error

Invalid Email

Expect:

Validation Error

Invalid Phone

Expect:

Validation Error

Missing Name

Expect:

Validation Error

Missing Tier

Expect:

Validation Error

Missing Vehicle Make

Expect:

Validation Error

Missing Vehicle Model

Expect:

Validation Error

Missing Date

Expect:

Validation Error

Missing Time

Expect:

Validation Error

Missing Photo Permission

Expect:

Validation Error

---

# Integration Tests

Successful Booking

Expect:

* Booking created
* Success response returned

Slot Full

Given:

3 existing bookings

Expect:

409 BLOCK_FULL

Database Failure

Expect:

500 SERVER_ERROR

Email Failure

Expect:

Booking remains valid

Duplicate Submit

Expect:

Only one booking created

Race Condition

Given:

Multiple simultaneous requests

Expect:

Maximum 3 bookings

Concurrent Capacity Enforcement

Given:

Block capacity = 3

When:

10 simultaneous booking requests are submitted

Then:

* Exactly 3 bookings exist
* 7 requests return BLOCK_FULL
* No duplicates exist
* Capacity never exceeds 3

---

# End-to-End Tests

Happy Path

Visit site

Book appointment

See success modal

Validation Failure

Submit empty form

See validation errors

Invalid Email

See validation error

Invalid Phone

See validation error

Block Full

See block full message

Network Failure

See retry message

---

# Environment Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

RESEND_API_KEY

OWNER_NOTIFICATION_EMAIL

---

# Deployment Process

1. Create Supabase project
2. Create appointments table
3. Create create_appointment RPC
4. Configure environment variables
5. Configure Resend
6. Deploy to Vercel
7. Run Playwright tests
8. Verify booking creation
9. Verify owner email delivery
10. Launch

---

# Future Enhancements

Google Calendar Sync

SMS Notifications

Customer Email Confirmation

Admin Dashboard

Appointment Rescheduling

Appointment Cancellation

Referral Tracking

Analytics

Vehicle Classification Automation

Payment Collection
