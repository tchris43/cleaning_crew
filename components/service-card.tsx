"use client";
import React from 'react';
import Link from "next/link";

export default function ServiceCard({
  tier,
  title,
  badge,
  featured = false,
  description,
  included = [],
  prices = { small: '', mid: '', large: '' }
}: {
  tier: "BASIC_REFRESH" | "DEEP_CLEAN" | "PREMIUM_RESTORE";
  title: string;
  badge?: string;
  featured?: boolean;
  description?: string;
  included?: string[];
  prices?: { small: string; mid: string; large: string };
}) {
  const getTierStyles = () => {
    switch (tier) {
      case "BASIC_REFRESH":
        return { bg: "bg-[#FFF9E7]", border: "border-[#E5C66E]/80", badge: "bg-[#E5C66E]" };
      case "DEEP_CLEAN":
        return { bg: "bg-[#F2F9F0]", border: "border-[#A8C69F]/80", badge: "bg-[#A8C69F]" };
      case "PREMIUM_RESTORE":
        return { bg: "bg-[#F6F4FF]", border: "border-[#B8AFE5]/80", badge: "bg-[#B8AFE5]" };
      default:
        return { bg: "bg-white", border: "border-primary/20", badge: "bg-accent" };
    }
  };

  const styles = getTierStyles();

  return (
    <Link
      href={`/book?tier=${tier}`}
      className={`group relative flex h-full min-w-0 flex-col gap-2.5 rounded-xl border-2 p-3 no-underline transition-all duration-200 sm:gap-3 sm:p-4 md:p-5
        ${styles.bg} ${styles.border}
        ${featured ? "shadow-md ring-1 ring-[#A8C69F]/40" : "shadow-sm"}
        hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-[#20263F] shadow-sm sm:px-4 sm:text-xs ${styles.badge}`}>
          {badge}
        </div>
      )}

      <header>
        <h3 className="tier-title">{title}</h3>
        <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-[#20263F]/50 sm:text-xs">
          Choose your package
        </p>
      </header>

      {description && (
        <p className="text-xs leading-relaxed text-[#20263F]/75 sm:text-sm">{description}</p>
      )}

      {included.length > 0 && (
        <ul className="mt-0.5 space-y-1 text-xs leading-relaxed text-[#20263F]/90 sm:text-sm">
          {included.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#20263F]/30" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto border-t border-[#20263F]/8 pt-3 sm:pt-4">
        <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#20263F]/55 sm:text-xs">
          Pricing
        </div>
        <div className="mt-1 space-y-0.5 text-sm text-[#20263F] sm:text-[0.9375rem]">
          <div><span className="font-medium">Small</span> · {prices.small}</div>
          <div><span className="font-medium">Mid-Sized</span> · {prices.mid}</div>
          <div><span className="font-medium">Large</span> · {prices.large}</div>
        </div>
        <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-wide text-[#20263F]/45 transition-colors group-hover:text-[#20263F]/70 sm:text-xs">
          Book this package →
        </p>
      </div>
    </Link>
  );
}
