import type { ReactNode } from "react";
import '../styles/globals.css';
import Header from "../components/header";
import IconAttribution from "../components/icon-attribution";

export const metadata = {
  title: "Clean Crew Detail",
  description: "Professional interior detailing in Utah County. Book online in minutes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#EEF1F5] text-[#20263F] antialiased">
        <div className="mx-auto max-w-6xl px-3 py-4 md:px-5 md:py-6">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(32,38,63,0.08)]">
            <div className="bubble-motif relative bg-[#A5D7E8] px-4 pb-10 pt-5 md:px-8 md:pb-12 md:pt-6">
              <div className="relative z-10">
                <Header />
              </div>
            </div>

            <div className="relative z-10 -mt-6 rounded-t-2xl bg-white px-4 pb-8 md:px-8">
              {children}
              <IconAttribution />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
