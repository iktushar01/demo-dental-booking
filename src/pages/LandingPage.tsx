import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsSection } from '../components/landing/StatsSection';
import { ServicesGrid } from '../components/landing/ServicesGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { DentistTeam } from '../components/landing/DentistTeam';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { ContactSection } from '../components/landing/ContactSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <ServicesGrid />
      <HowItWorks />
      <DentistTeam />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
};
