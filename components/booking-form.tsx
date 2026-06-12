"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import WeekPicker from "./week-picker";
import { VEHICLE_SIZE_GUIDE } from "../lib/vehicle-size-guide";
import SuccessModal from "./success-modal";
import { SERVICE_TIERS, ADDONS, TierId, VehicleSize } from "../lib/services";

export default function BookingForm() {
  const searchParams = useSearchParams();
  
  // Form State
  const [tier, setTier] = useState<TierId>("BASIC_REFRESH");
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("SMALL");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  
  // UI State
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);

  // Preload Tier from URL
  useEffect(() => {
    const t = searchParams?.get('tier') as TierId;
    if (t && SERVICE_TIERS[t]) {
      setTier(t);
    }
  }, [searchParams]);

  // Price Calculation
  const totalPrice = useMemo(() => {
    let base = SERVICE_TIERS[tier].prices[vehicleSize];
    let addonsTotal = selectedAddons.reduce((acc, addonId) => {
      const addon = ADDONS.find(a => a.id === addonId);
      return acc + (addon?.basePrice || 0);
    }, 0);
    return base + addonsTotal;
  }, [tier, vehicleSize, selectedAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
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
      phone,
      email,
      serviceTier: tier,
      vehicleSize,
      appointmentDate: appointmentDate.toISOString().split('T')[0],
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
        setErrors([json?.message || "Something went wrong. Please try again."]);
      } else {
        setSuccess(true);
        setSuccessDetails({ 
          date: payload.appointmentDate, 
          time: appointmentTime, 
          tier: SERVICE_TIERS[tier].title, 
          vehicle: vehicleSize 
        });
      }
    } catch (err) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-10 text-center">
        <h1 className="flyer-heading text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#20263F]">
          Secure Your Slot
        </h1>
        <p className="mt-4 text-lg font-medium text-[#20263F]/60 max-w-2xl mx-auto">
          Confirm your professional detailing appointment in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Service & Size Section */}
          <section className="space-y-6 rounded-3xl border-2 border-[#20263F]/10 bg-white p-6 shadow-sm">
            <h4 className="flyer-heading text-lg font-bold uppercase text-[#20263F] border-b border-[#20263F]/5 pb-2">1. Vehicle & Service</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[0.65rem] font-black uppercase tracking-widest text-[#20263F]/50 mb-1">Service Tier</label>
                <select 
                  className="w-full rounded-xl border-2 border-[#20263F]/10 bg-[#F0F2F5] p-3 font-bold text-[#20263F] outline-none focus:border-[#20263F]"
                  value={tier}
                  onChange={(e) => setTier(e.target.value as TierId)}
                >
                  {Object.values(SERVICE_TIERS).map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[0.65rem] font-black uppercase tracking-widest text-[#20263F]/50">Vehicle Size</label>

                </div>
                <select 
                  className="w-full rounded-xl border-2 border-[#20263F]/10 bg-[#F0F2F5] p-3 font-bold text-[#20263F] outline-none focus:border-[#20263F]"
                  value={vehicleSize}
                  onChange={(e) => setVehicleSize(e.target.value as VehicleSize)}
                >
                  <option value="SMALL">Sedans, Coupes, Small Trucks</option>
                  <option value="MID-SIZED">Small 3rd row, larger trucks</option>
                  <option value="LARGE">Full-sized SUVs, minivans</option>
                </select>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-6 rounded-3xl border-2 border-[#20263F]/10 bg-white p-6 shadow-sm">
            <h4 className="flyer-heading text-lg font-bold uppercase text-[#20263F] border-b border-[#20263F]/5 pb-2">2. Contact Info</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[0.65rem] font-black uppercase tracking-widest text-[#20263F]/50 mb-1">Phone Number</label>
                <input 
                  type="tel"
                  required
                  className="w-full rounded-xl border-2 border-[#20263F]/10 bg-[#F0F2F5] p-3 font-bold text-[#20263F] outline-none focus:border-[#20263F]"
                  placeholder="385-___-____"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[0.65rem] font-black uppercase tracking-widest text-[#20263F]/50 mb-1">Email Address</label>
                <input 
                  type="email"
                  required
                  className="w-full rounded-xl border-2 border-[#20263F]/10 bg-[#F0F2F5] p-3 font-bold text-[#20263F] outline-none focus:border-[#20263F]"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Add-ons Section */}
        <section className="space-y-4 rounded-3xl border-2 border-[#20263F]/10 bg-white p-6 shadow-sm">
          <h4 className="flyer-heading text-lg font-bold uppercase text-[#20263F]">3. Additional Surcharges</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {ADDONS.map(addon => (
              <label key={addon.id} className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-colors ${selectedAddons.includes(addon.id) ? 'bg-[#20263F]/5 border-[#20263F]' : 'bg-[#F0F2F5] border-transparent hover:border-[#20263F]/20'}`}>
                <input 
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="h-4 w-4 accent-[#20263F]"
                />
                <div className="leading-tight">
                  <p className="text-[0.65rem] font-black uppercase text-[#20263F]">{addon.label}</p>
                  <p className="text-[0.6rem] font-bold text-[#20263F]/40">+${addon.basePrice}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Scheduling Section */}
        <section className="space-y-4 rounded-3xl border-2 border-[#20263F]/10 bg-white p-6 shadow-sm">
          <h4 className="flyer-heading text-lg font-bold uppercase text-[#20263F]">4. Appointment Date & Time</h4>
          <WeekPicker 
            selectedDate={appointmentDate}
            selectedTime={appointmentTime}
            onChange={(d, t) => {
              setAppointmentDate(d);
              setAppointmentTime(t);
            }}
          />
        </section>

        {/* Pricing & Submit */}
        <div className="flex flex-col items-center justify-between gap-6 pt-10 border-t border-[#20263F]/10 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-[0.6rem] font-black uppercase tracking-widest text-[#20263F]/40">Estimated Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#20263F]">${totalPrice}</span>
              <span className="text-sm font-bold text-[#20263F]/30 uppercase tracking-widest">Base</span>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            {errors.length > 0 && <p className="mb-2 text-xs font-bold text-red-500 uppercase text-center">{errors[0]}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-2xl bg-[#E5C66E] px-20 py-6 text-xl font-black uppercase tracking-widest text-[#20263F] shadow-[0_10px_20px_-5px_rgba(229,198,110,0.4)] transition-all hover:scale-[1.02] hover:bg-[#D9A62E] active:scale-95 disabled:opacity-50 md:w-auto"
            >
              {loading ? "Sending..." : "Complete Booking"}
            </button>
          </div>
        </div>
      </form>

      <details className="mt-2">
        <summary className="cursor-pointer text-sm underline text-[#20263F]">Size Guide</summary>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {VEHICLE_SIZE_GUIDE.map((category) => (
            <article key={category.size} className={`rounded-xl border-2 border-[#20263F]/5 p-6 shadow-sm ${category.badgeClass}`}>
              <div className="inline-flex rounded-full bg-white/40 px-4 py-1 text-2xl font-black text-[#20263F]">
                {category.size}
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#20263F]/60 px-1">{category.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm font-medium text-[#20263F]">
                {category.vehicles.map((vehicle) => (
                  <li key={vehicle} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#20263F]/20"></span>
                    {vehicle}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </details>
      
      <SuccessModal 
        open={success} 
        onClose={() => setSuccess(false)} 
        details={successDetails} 
      />
    </div>
  );
}
