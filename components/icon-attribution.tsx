"use client";

import { usePathname } from "next/navigation";

export default function IconAttribution() {
  const pathname = usePathname();

  if (pathname?.startsWith("/book")) {
    return null;
  }

  return (
    <p className="border-t border-[#20263F]/6 px-4 py-2.5 text-center text-[0.625rem] leading-relaxed text-[#20263F]/38 md:px-8">
      Basic package icon by{" "}
      <a
        href="https://www.svgrepo.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-[#20263F]/20 underline-offset-2 hover:text-[#20263F]/55"
      >
        wishforge.games
      </a>{" "}
      (
      <a
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-[#20263F]/20 underline-offset-2 hover:text-[#20263F]/55"
      >
        CC BY
      </a>
      ), via SVG Repo.
    </p>
  );
}
