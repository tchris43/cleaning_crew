"use client";
import { usePathname } from 'next/navigation';
import Header from './header';

export default function NavBanner() {
  const pathname = usePathname();
  
  // Hide header on booking page to avoid duplication
  if (pathname === '/book') return null;

  return (
    <div className="bubble-motif relative bg-[#A5D7E8] px-4 pt-6 pb-12 md:px-8 md:pt-8 md:pb-16 mb-[-2rem] z-0">
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <Header />
      </div>
    </div>
  );
}
