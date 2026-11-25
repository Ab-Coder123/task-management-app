import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingAuthRedirect from '@/components/landing/LandingAuthRedirect';
import LandingHero from '@/components/landing/LandingHero';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingDepartments from '@/components/landing/LandingDepartments';
import LandingRolesFaq from '@/components/landing/LandingRolesFaq';
import LandingFooter from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingAuthRedirect />
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingDepartments />
        <LandingRolesFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
