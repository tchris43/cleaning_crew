import ServiceCard from "../components/service-card";
import { VEHICLE_SIZE_GUIDE } from "../lib/vehicle-size-guide";

export default function HomePage() {
  return (
    <main className="space-y-10 md:space-y-12">
      <section className="rounded-xl bg-[#D9A62E] px-4 py-3 text-center">
        <p className="flyer-heading text-sm font-semibold uppercase tracking-wide text-[#20263F] md:text-base">
          First 20 customers receive a 10% discount
        </p>
      </section>

      <section>
        <div className="grid grid-cols-3 items-stretch gap-2 sm:gap-4 md:gap-5">
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
        <p className="mt-4 text-center text-xs font-medium text-[#20263F]/50">
          10% off for multiple vehicles
        </p>
      </section>

      <section className="rounded-2xl border border-[#20263F]/10 bg-[#FAFBFC] p-5 md:p-7">
        <h2 className="section-title">Vehicle Size Guide</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {VEHICLE_SIZE_GUIDE.map((category) => (
            <article
              key={category.size}
              className={`rounded-xl border border-[#20263F]/8 bg-white p-4 shadow-sm sm:p-5 ${category.badgeClass}`}
            >
              <div className="inline-flex rounded-full bg-white/60 px-3 py-1 text-base font-semibold text-[#20263F] sm:text-lg">
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
      </section>

      <section className="rounded-2xl border border-[#20263F]/15 bg-white p-6 text-center md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#20263F]/45">
          Call or text for questions
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-[#20263F] sm:text-4xl">
          385-685-8941
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
