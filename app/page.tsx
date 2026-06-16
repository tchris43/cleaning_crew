import Link from "next/link";
import ServiceCard from "../components/service-card";
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "../lib/contact";
import { VEHICLE_SIZE_GUIDE } from "../lib/vehicle-size-guide";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Choose your package",
    detail: "Pick a tier and vehicle size based on the flyer pricing."
  },
  {
    step: "2",
    title: "Select a time",
    detail: "Book a slot that fits our posted business hours."
  },
  {
    step: "3",
    title: "We confirm details",
    detail: "Submit your request — we'll reach out if anything else is needed."
  }
];

export default function HomePage() {
  return (
    <main className="space-y-10 md:space-y-12">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-brand">Clean Crew Detail</p>
          <p className="home-hero-eyebrow">Interior detailing · Utah County</p>
          <h1 className="home-hero-headline">Professional car care, booked in minutes</h1>
          <p className="home-hero-copy">
            See pricing, pick your package, and request an appointment — no accounts, no hassle.
          </p>
          <Link href="/book" className="btn-primary mt-6 inline-flex px-6 py-3 text-base">
            Book appointment
          </Link>
        </div>
      </section>

      <section id="services">
        <div className="tier-cards-scroll">
          <div className="tier-cards-grid">
          <ServiceCard
            tier="BASIC_REFRESH"
            title="Basic Interior Refresh"
            description="Freshen up with professional equipment"
            included={[
              "Air purge with air compressor",
              "Thorough vacuum of all areas",
              "Wipe down dashboard, console, and door panels",
              "Clean interior glass and floor mats"
            ]}
            prices={{ small: "$79", mid: "$99", large: "$129" }}
          />

          <ServiceCard
            tier="DEEP_CLEAN"
            title="Deep Clean Interior"
            badge="Most Popular"
            featured
            description="Make your car feel like new or prepare it for sale"
            included={[
              "Includes Basic Plus",
              "Shampoo and steam clean all seats, carpets, and mats",
              "Stain treatment on hard plastics, trims, and cup holders",
              "Clean and moisturize leather to prevent cracking"
            ]}
            prices={{ small: "$169", mid: "$199", large: "$239" }}
          />

          <ServiceCard
            tier="PREMIUM_RESTORE"
            title="Premium Restoration"
            description="Showroom finish for vehicles requiring meticulous care"
            included={[
              "Includes Deep Clean Plus",
              "Apply UV protectant to plastics and vinyl surfaces",
              "Apply trim dressing to dashboard and console plastics",
              "Headliner and roof brush cleaning"
            ]}
            prices={{ small: "$249", mid: "$299", large: "$349" }}
          />
          </div>
        </div>
        <p className="mt-4 text-center text-xs font-medium text-[#20263F]/50">
          10% off for multiple vehicles
        </p>
      </section>

      <section className="rounded-2xl border border-[#20263F]/10 bg-white p-5 md:p-7">
        <h2 className="section-title">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <article key={item.step} className="rounded-xl border border-[#20263F]/8 bg-[#FAFBFC] p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#20263F] text-sm font-semibold text-white">
                {item.step}
              </span>
              <h3 className="mt-3 text-base font-semibold text-[#20263F]">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#20263F]/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <details id="size-guide" className="size-guide-disclosure scroll-mt-6 rounded-2xl border border-[#20263F]/10 bg-[#FAFBFC] p-5 md:p-7">
        <summary className="section-title size-guide-disclosure-summary">
          Vehicle Size Guide
        </summary>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {VEHICLE_SIZE_GUIDE.map((category) => (
            <article
              key={category.size}
              className={`rounded-xl p-4 shadow-sm sm:p-5 ${category.cardClass}`}
            >
              <div className="size-guide-pill inline-flex rounded-full px-3 py-1 text-base font-semibold text-[#20263F] sm:text-lg">
                {category.size}
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#20263F]/55">
                {category.description}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-[#20263F]/90 sm:text-sm">
                {category.vehicles.map((vehicle) => (
                  <li key={vehicle}>{vehicle}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </details>

      <section id="contact" className="rounded-2xl border border-[#20263F]/15 bg-white p-6 text-center md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#20263F]/45">
          Call, text, or email for questions
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-[#20263F] sm:text-4xl">
          <a href={`tel:${SUPPORT_PHONE_TEL}`} className="hover:underline underline-offset-4">
            {SUPPORT_PHONE}
          </a>
        </p>
        <p className="mt-3 text-base font-medium text-[#20263F]/80 md:text-lg">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline underline-offset-4">
            {SUPPORT_EMAIL}
          </a>
        </p>

        <div className="mt-8 border-t border-[#20263F]/8 pt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#20263F]/70">
            Condition surcharges may apply
          </h3>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-[#20263F]/80">
            <p>Excessive pet hair: <span className="font-semibold text-[#D9A62E]">+$35–75</span></p>
            <p>Heavy staining or mud: <span className="font-semibold text-[#D9A62E]">+$50–100</span></p>
            <p>Mold or biohazards (vomit, blood, urine): <span className="font-semibold text-[#D9A62E]">+$100–200</span></p>
          </div>
        </div>
      </section>
    </main>
  );
}
