# Clean Crew Detailing Deployment and Operations Runbook

## Purpose

This runbook explains how to deploy and operate a Next.js + Supabase + Resend application for the first time.

It is written for a developer who has never shipped this stack before and needs a practical, repeatable path from local code to production.

This project should follow a test-first workflow. Do not deploy UI work until the database schema, booking RPC, and integration tests for booking creation and capacity enforcement are passing.

---

## System Overview

Core services:

* Next.js application for the website and API routes
* Supabase Postgres for the booking database and booking RPC
* Resend for notification email delivery
* Vercel for hosting and deployment

Core deployment rule:

* Capacity enforcement must live in the database, inside the booking creation RPC.
* The application should call the RPC instead of doing count-then-insert logic in app code.

---

## What You Need Before You Start

Create accounts and install tools:

* GitHub account
* Supabase account
* Resend account
* Vercel account
* Node.js LTS
* Git
* A code editor such as VS Code

Recommended local tools:

* Supabase CLI
* Vercel CLI

---

## First-Time Setup Checklist

1. Clone the repository.
2. Install dependencies.
3. Run the test suite locally.
4. Create the Supabase project.
5. Apply the database schema.
6. Create the booking RPC.
7. Configure environment variables locally.
8. Verify the app can create bookings in a staging-like environment.
9. Connect the repo to Vercel.
10. Add production environment variables.
11. Configure Resend.
12. Deploy.
13. Run smoke tests.

---

## Local Development Setup

### 1. Install Dependencies

Use the project package manager once the codebase exists.

Typical examples:

* `npm install`
* `pnpm install`
* `yarn install`

### 2. Create Local Environment Variables

Create a `.env.local` file with the values required by the app.

Expected variables:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `RESEND_API_KEY`
* `OWNER_NOTIFICATION_EMAIL`

Keep service role keys only on the server side. Never expose them in client code.

### 3. Run the App Locally

Typical Next.js commands:

* `npm run dev`
* `npm run test`
* `npm run test:integration`

If the repository uses a different package manager or script names, use the project scripts defined in `package.json`.

---

## Supabase Setup

### 1. Create the Project

In Supabase:

1. Create a new project.
2. Save the project URL.
3. Save the anon key.
4. Save the service role key.

### 2. Create the Database Schema

The schema should include the appointments table, enums, and constraints described in the design docs.

Minimum booking fields:

* id
* created_at
* name
* phone
* email
* service_tier
* vehicle_make
* vehicle_model
* appointment_date
* appointment_time
* time_block
* block_capacity_snapshot
* photo_permission
* notes
* status

Database rules to enforce:

* At least one contact method is required.
* Appointment status must be one of the allowed values.
* Each booking is tied to a date and time block.
* Capacity for a block is limited to 3 bookings.

Recommended approach:

* Keep the schema in a migration file.
* Apply it to local, staging, and production in the same order.

### 3. Create the RPC Function

Create a Postgres RPC named `create_appointment`.

The RPC must:

1. Check the current block capacity.
2. Reject the request if the block is full.
3. Insert the booking if there is room.
4. Return a success or failure result.

Important:

* Do not split the check and insert into separate application calls.
* Keep the logic transaction-safe so concurrent requests cannot overbook a slot.

### 4. Test the RPC Before Deployment

Use integration tests or direct SQL calls to verify:

* A valid booking succeeds.
* The fourth booking for a slot returns `BLOCK_FULL`.
* Concurrent requests do not exceed capacity.
* Duplicate requests do not create duplicate rows.

If the RPC fails under concurrency, do not deploy the app yet.

---

## Resend Setup

### 1. Create an API Key

In Resend:

1. Create an API key.
2. Copy it into your environment variables as `RESEND_API_KEY`.

### 2. Verify a Sending Domain or Use the Default Sender

For production use, verify a sending domain if possible.

If you are early in development:

* Use the default Resend sender for testing.
* Confirm that messages are arriving before launch.

### 3. Configure the Owner Notification Address

Set `OWNER_NOTIFICATION_EMAIL` to the email address that should receive booking notifications.

### 4. Decide How Customer Email Is Handled

Customer notifications are optional in the design.

Rules:

* Do not block bookings if email delivery fails.
* Booking creation must remain successful even if notification sending fails.

---

## Vercel Deployment

### 1. Connect the Repository

In Vercel:

1. Import the GitHub repository.
2. Let Vercel detect the Next.js project.
3. Confirm the build command and output settings.

### 2. Configure Environment Variables

Add the production values in Vercel:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `RESEND_API_KEY`
* `OWNER_NOTIFICATION_EMAIL`

Make sure the production values point to the production Supabase project and production Resend key.

### 3. Deploy the First Production Build

Trigger a deployment from the main branch.

After the build finishes, verify:

* The site loads.
* The booking form renders.
* API routes respond.
* The booking flow can save a record.

---

## Recommended Environment Strategy

Use three environments:

* Local development
* Staging or preview
* Production

Suggested rules:

* Local development may use a dedicated local or development Supabase project.
* Preview deployments should use non-production credentials.
* Production should use only production credentials.

Do not test destructive changes directly in production unless the risk is low and you have a rollback path.

---

## Deployment Order

Use this order for first launch:

1. Finalize the database schema.
2. Finalize the booking RPC.
3. Run integration tests against the booking flow.
4. Configure Resend.
5. Configure Vercel environment variables.
6. Deploy the app.
7. Run smoke tests.
8. Confirm notifications are sent.
9. Confirm bookings appear in Supabase.

Do not reverse the order by deploying UI before booking correctness is proven.

---

## Smoke Test Checklist

After every deployment, test the following:

### Booking Creation

* Submit a valid booking.
* Confirm the success response appears.
* Confirm the booking exists in Supabase.

### Capacity Enforcement

* Fill a slot with 3 bookings.
* Attempt a fourth booking.
* Confirm the request is rejected with the slot-full error.

### Validation Handling

* Submit without required fields.
* Confirm validation errors appear.

### Email Handling

* Confirm owner notification email is delivered.
* If a customer email is provided, confirm the optional customer notification path does not block the booking.

### Recovery

* Refresh the success page.
* Confirm no duplicate booking is created.

---

## Operations Checklist

Use this list during normal operation:

* Review Vercel deployment status.
* Review Supabase logs for booking failures.
* Review application logs for API errors.
* Confirm Resend delivery status for notification issues.
* Monitor booking volume against expected capacity.

If a problem appears, identify whether it is:

* A validation problem
* A database problem
* An email delivery problem
* A deployment/configuration problem

Fix the smallest layer that explains the failure.

---

## Monitoring and Logging

Log important failures to:

* `console.error()`
* Vercel logs
* Supabase logs

Log these events:

* Validation failures
* RPC failures
* Database write failures
* Email failures

Do not log secrets or full payment-like personal data. Keep logs useful but minimal.

---

## Backup and Data Protection

Supabase is the primary data store, so the booking table is the critical asset.

Recommended habits:

* Export or back up the booking data regularly.
* Keep schema migrations in source control.
* Keep the RPC function in source control.
* Test restores before you depend on them.

For the MVP, Supabase dashboard export is acceptable if you do not yet have an automated backup pipeline.

---

## Rollback Procedure

If a deployment breaks booking creation:

1. Stop new releases.
2. Revert the last code change.
3. Re-deploy the previous known-good build.
4. Verify booking creation again.
5. Verify capacity enforcement again.

If the issue is in the database schema or RPC:

1. Revert to the last known-good migration.
2. Re-apply the working schema.
3. Re-run the integration tests.

If the issue is with Resend:

1. Disable the failing notification path.
2. Keep booking creation working.
3. Repair email configuration separately.

Bookings should remain the priority. Email failure must not block booking persistence.

---

## Incident Response

### If Bookings Stop Saving

1. Check the API route logs.
2. Check Supabase logs.
3. Check the RPC function.
4. Confirm the environment variables are correct.
5. Confirm the database is reachable.

### If Slots Are Overfilling

1. Treat it as a database correctness issue.
2. Verify the RPC transaction logic.
3. Verify the tests that simulate concurrent requests.
4. Patch the database layer before touching UI.

### If Emails Stop Sending

1. Check the Resend API key.
2. Check the sender verification status.
3. Check the owner email address.
4. Confirm the app still saves bookings even when email fails.

### If Deployments Fail

1. Read the Vercel build logs.
2. Fix the build or runtime error.
3. Redeploy after the fix.

---

## Common Mistakes to Avoid

* Do not implement capacity with a client-side counter.
* Do not rely on separate count and insert calls in application code.
* Do not deploy UI before booking correctness is tested.
* Do not expose the Supabase service role key to the browser.
* Do not treat email failure as a booking failure.
* Do not skip concurrency testing.

---

## Launch Day Checklist

Before announcing the site:

1. Confirm the production site loads.
2. Confirm the booking form submits successfully.
3. Confirm a booking appears in Supabase.
4. Confirm the success message appears.
5. Confirm slot-full behavior works.
6. Confirm the owner receives notification email.
7. Confirm logs are accessible.
8. Confirm you know how to roll back.

If any of these fail, do not launch yet.

---

## Post-Launch Routine

Daily:

* Check for failed bookings.
* Check for failed notifications.
* Check for unusual deployment errors.

Weekly:

* Review booking volume.
* Export booking data if needed.
* Confirm no schema or config drift has occurred.

Monthly:

* Review logs and error patterns.
* Confirm backups can still be restored.
* Check whether any operational pain points need automation.

---

## Suggested File Locations

As the codebase grows, keep the deployment-critical pieces easy to find:

* SQL migrations for the schema and RPC
* Integration tests for booking creation and capacity enforcement
* Server-side Supabase client code
* Resend email service code
* Deployment notes in this runbook

---

## Final Rule

If a change can affect booking correctness, prove it with tests before you ship it.
