"use client";

import Link from "next/link";
import React from "react";
import Logo from "./logo";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/#services", label: "Packages" },
  { href: "/#size-guide", label: "Size guide" },
  { href: "/#contact", label: "Contact" }
];

export default function Header() {
  const pathname = usePathname();
  const isBookingPage = pathname === "/book";

  return (
    <header className="site-header-wrap">
      <div className="site-discount-banner">
        First 20 customers receive a 10% discount
      </div>

      <div className="site-header-row">
        <Link href="/" className="site-logo" aria-label="Clean Crew Detailing home">
          <Logo variant="white" className="h-[52px] w-auto md:h-[64px]" />
        </Link>

        <nav className="site-nav-center" aria-label="Main navigation">
          <ul className="site-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-cta">
          <Link
            href={isBookingPage ? "/" : "/book"}
            className={isBookingPage ? "header-cta header-cta-secondary" : "header-cta header-cta-accent"}
          >
            {isBookingPage ? "Back to home" : "Book appointment"}
          </Link>
        </div>
      </div>
    </header>
  );
}
