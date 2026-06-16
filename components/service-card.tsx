"use client";

import React from "react";
import Link from "next/link";
import TierIcon from "./tier-icon";

export default function ServiceCard({
  tier,
  title,
  badge,
  featured = false,
  description,
  included = [],
  prices = { small: "", mid: "", large: "" }
}: {
  tier: "BASIC_REFRESH" | "DEEP_CLEAN" | "PREMIUM_RESTORE";
  title: string;
  badge?: string;
  featured?: boolean;
  description?: string;
  included?: string[];
  prices?: { small: string; mid: string; large: string };
}) {
  const tierConfig = {
    BASIC_REFRESH: {
      card: "tier-card--basic",
      border: "tier-border--basic",
      badge: "tier-badge--basic",
      icon: "tier-icon--basic",
      tagline: "tier-tagline--basic",
      featuredRing: ""
    },
    DEEP_CLEAN: {
      card: "tier-card--deep",
      border: "tier-border--deep",
      badge: "tier-badge--deep",
      icon: "tier-icon--deep",
      tagline: "tier-tagline--deep",
      featuredRing: "tier-ring--deep"
    },
    PREMIUM_RESTORE: {
      card: "tier-card--premium",
      border: "tier-border--premium",
      badge: "tier-badge--premium",
      icon: "tier-icon--premium",
      tagline: "tier-tagline--premium",
      featuredRing: ""
    }
  }[tier];

  return (
    <Link
      href={`/book?tier=${tier}`}
      className={`tier-card group relative flex h-full min-w-0 flex-col overflow-hidden text-left no-underline transition-all duration-200
        ${tierConfig.card} ${tierConfig.border}
        ${featured ? `shadow-md ${tierConfig.featuredRing}` : "shadow-sm"}
        ${badge ? "pt-5" : ""}
        hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {tier === "PREMIUM_RESTORE" && <div className="tier-shine-line" aria-hidden="true" />}

      {badge && (
        <div
          className={`absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide shadow-sm sm:px-4 sm:text-xs ${tierConfig.badge}`}
        >
          {badge}
        </div>
      )}

      <header className="tier-card-section">
        <TierIcon tier={tier} className={`tier-card-icon ${tierConfig.icon}`} />
        <div className="min-w-0">
          <h3 className="tier-title">{title}</h3>
          {description && <p className={`tier-tagline ${tierConfig.tagline}`}>{description}</p>}
        </div>
      </header>

      {included.length > 0 && (
        <ul className="tier-feature-list">
          {included.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      <div className="tier-card-footer">
        <p className="tier-card-label">Pricing</p>
        <ul className="tier-price-list">
          <li>
            <span className="font-medium">Small</span> · {prices.small}
          </li>
          <li>
            <span className="font-medium">Mid-Sized</span> · {prices.mid}
          </li>
          <li>
            <span className="font-medium">Large</span> · {prices.large}
          </li>
        </ul>
        <p className="tier-card-cta">Book this package →</p>
      </div>
    </Link>
  );
}
