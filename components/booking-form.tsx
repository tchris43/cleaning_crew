"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WeekPicker from "./week-picker";
import { VEHICLE_SIZE_GUIDE } from "../lib/vehicle-size-guide";
import { BOOKING_CONFIRMATION_KEY } from "../lib/booking-confirmation";
import { SERVICE_TIERS, ADDONS, TierId, VehicleSize } from "../lib/services";
import { SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "../lib/contact";
import { formatLocalDate, formatTimeLabel } from "../lib/slots";

function getBookingErrorMessages(json: unknown, status: number): string[] {
  if (json && typeof json === "object") {
    const body = json as {
      code?: string;
      message?: string;
      errors?: Array<{ path: string; message: string }>;
    };

    if (body.code === "BLOCK_FULL") {
      return ["That time slot is full. Please choose another time."];
    }

    if (body.errors?.length) {
      return body.errors.map((error) => error.message);
    }

    if (body.message) {
      return [body.message];
    }
  }

  if (status >= 500) {
    return ["Server error. Please try again in a moment."];
  }

  return ["Something went wrong. Please try again."];
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tier, setTier] = useState<TierId>("BASIC_REFRESH");
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("SMALL");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const sizeGuideRef = useRef<HTMLDetailsElement>(null);

  function openSizeGuide(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    sizeGuideRef.current?.setAttribute("open", "");
    sizeGuideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const t = searchParams?.get("tier") as TierId;
    if (t && SERVICE_TIERS[t]) {
      setTier(t);
    }
  }, [searchParams]);

  const totalPrice = useMemo(() => {
    const base = SERVICE_TIERS[tier].prices[vehicleSize];
    const addonsTotal = selectedAddons.reduce((acc, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      return acc + (addon?.basePrice || 0);
    }, 0);
    return base + addonsTotal;
  }, [tier, vehicleSize, selectedAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime) {
      setErrors(["Please select a date and time."]);
      return;
    }

    setErrors([]);
    setLoading(true);

    const payload = {
      firstName,
      lastName,
      phone,
      email,
      serviceTier: tier,
      vehicleSize,
      appointmentDate: formatLocalDate(appointmentDate),
      appointmentTime,
      notes: notes || undefined,
      addons: selectedAddons
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok) {
        setErrors(getBookingErrorMessages(json, res.status));
      } else {
        sessionStorage.setItem(
          BOOKING_CONFIRMATION_KEY,
          JSON.stringify({
            firstName: payload.firstName,
            lastName: payload.lastName,
            date: payload.appointmentDate,
            time: formatTimeLabel(appointmentTime),
            tier: SERVICE_TIERS[tier].title,
            vehicle: vehicleSize,
            email: payload.email
          })
        );
        router.push("/book/success");
      }
    } catch {
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="page-intro">
        <h1>Book Appointment</h1>
        <p>
          <span className="font-semibold text-[#20263F]">{SERVICE_TIERS[tier].title}</span>
          <span className="mx-1.5 text-[#20263F]/35">·</span>
          <span>from ${SERVICE_TIERS[tier].prices[vehicleSize]}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <section className="form-section space-y-4">
            <h2 className="form-step-title">1. Vehicle & Service</h2>
            <div>
              <label className="form-label" htmlFor="serviceTier">
                Service tier
              </label>
              <select
                id="serviceTier"
                className="field-input mt-0 font-medium"
                value={tier}
                onChange={(e) => setTier(e.target.value as TierId)}
              >
                {Object.values(SERVICE_TIERS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <label className="form-label mb-0" htmlFor="vehicleSize">
                  Vehicle size
                </label>
                <a
                  href="#size-guide"
                  onClick={openSizeGuide}
                  className="text-xs font-semibold text-[#20263F]/65 underline-offset-2 hover:text-[#20263F] hover:underline"
                >
                  Size guide
                </a>
              </div>
              <select
                id="vehicleSize"
                className="field-input mt-0 font-medium"
                value={vehicleSize}
                onChange={(e) => setVehicleSize(e.target.value as VehicleSize)}
              >
                <option value="SMALL">Small — sedans, 2-rows, small trucks</option>
                <option value="MID-SIZED">Mid-sized — small 3rd rows, larger trucks</option>
                <option value="LARGE">Large — full-sized SUVs, minivans</option>
              </select>
            </div>
          </section>

          <section className="form-section space-y-4">
            <h2 className="form-step-title">2. Contact info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  className="field-input mt-0 font-medium"
                  placeholder="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  className="field-input mt-0 font-medium"
                  placeholder="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                className="field-input mt-0 font-medium"
                placeholder="385-555-1234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="field-input mt-0 font-medium"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </section>
        </div>

        <section className="form-section space-y-3">
          <h2 className="form-step-title">3. Condition surcharges (optional)</h2>
          <p className="text-sm text-[#20263F]/65">
            Select any that may apply. Final pricing is confirmed after inspection.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {ADDONS.map((addon) => (
              <label
                key={addon.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                  selectedAddons.includes(addon.id)
                    ? "border-[#20263F]/25 bg-white shadow-sm"
                    : "border-transparent bg-white/70 hover:border-[#20263F]/15"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="mt-0.5 h-4 w-4 accent-[#20263F]"
                />
                <div className="leading-snug">
                  <p className="text-sm font-medium text-[#20263F]">{addon.label}</p>
                  <p className="text-xs text-[#20263F]/50">from +${addon.basePrice}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="form-section space-y-4">
          <h2 className="form-step-title">4. Date & time</h2>
          <WeekPicker
            selectedDate={appointmentDate}
            selectedTime={appointmentTime}
            onChange={(date, time) => {
              setAppointmentDate(date);
              setAppointmentTime(time);
            }}
          />
        </section>

        <section className="form-section space-y-2">
          <label className="form-label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className="field-input mt-0 resize-y font-medium"
            placeholder="Vehicle details, access instructions, or special requests"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#20263F]/10 bg-[#FAFBFC] p-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#20263F]/45">
              Estimated total
            </p>
            <p className="mt-1 text-3xl font-semibold text-[#20263F]">${totalPrice}</p>
            {selectedAddons.length > 0 && (
              <p className="mt-1 text-xs text-[#20263F]/55">Includes selected surcharges</p>
            )}
          </div>

          <div className="md:min-w-[220px]">
            {errors.length > 0 && (
              <div className="mb-2 text-center text-sm text-red-600 md:text-right">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? "Sending…" : "Complete booking"}
            </button>
            <p className="mt-2 text-center text-xs text-[#20263F]/55 md:text-right">
              Having trouble? Call or text{" "}
              <a
                href={`tel:${SUPPORT_PHONE_TEL}`}
                className="font-semibold text-[#20263F]/80 underline-offset-2 hover:underline"
              >
                {SUPPORT_PHONE}
              </a>
            </p>
          </div>
        </div>
      </form>

      <details
        id="size-guide"
        ref={sizeGuideRef}
        className="mt-8 scroll-mt-6 rounded-xl border border-[#20263F]/10 bg-[#FAFBFC] p-4"
      >
        <summary className="cursor-pointer text-sm font-semibold text-[#20263F]">
          Vehicle size guide
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {VEHICLE_SIZE_GUIDE.map((category) => (
            <article
              key={category.size}
              className={`rounded-xl p-4 ${category.cardClass}`}
            >
              <div className="size-guide-pill inline-flex rounded-full px-3 py-1 text-sm font-semibold text-[#20263F]">
                {category.size}
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#20263F]/55">
                {category.description}
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-[#20263F]/90">
                {category.vehicles.map((vehicle) => (
                  <li key={vehicle}>{vehicle}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </details>
    </div>
  );
}
