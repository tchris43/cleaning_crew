"use client";
import Link from "next/link";
import React from "react";
import Logo from "./logo";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isBookingPage = pathname === "/book";
  const linkHref = isBookingPage ? "/" : "/book";
  const linkText = isBookingPage ? "← Back to Home" : "Book Appointment";

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4">
      <Logo variant="white" />

      <nav>
        <Link
          href={linkHref}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#20263F] shadow-sm transition hover:bg-[#F7FAFC] hover:shadow"
        >
          {linkText}
        </Link>
      </nav>
    </header>
  );
}
