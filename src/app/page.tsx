import type { Metadata } from "next";
import HeroSection from "@/app/components/landing/HeroSection";
import Navbar from "@/app/components/landing/Navbar";
import PlatformOverview from "@/app/components/landing/PlatformOverview";
import CoreFeatures from "@/app/components/landing/CoreFeatures";
import UserPortals from "@/app/components/landing/UserPortals";
import HowItWorks from "@/app/components/landing/HowItWorks";
import WhyNexus from "@/app/components/landing/WhyNexus";
import FinalCTA from "@/app/components/landing/FinalCTA";
export const metadata: Metadata = {
  title: "A New Era of University Life",
  description:
    "Discover NEXUS, a connected university management experience for students, faculty, and administrators.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <PlatformOverview />
      <CoreFeatures />
      <UserPortals />
      <HowItWorks />
      <WhyNexus />
      <FinalCTA />
      <footer className="border-t border-white/[0.06] px-5 py-7 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NEXUS University System</p>
          <p className="tracking-wide">
            DESIGNED FOR THE NEXT GENERATION
          </p>
        </div>
      </footer>
    </>
  );
}