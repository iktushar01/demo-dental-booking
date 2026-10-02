import React from 'react';
import { useRouter } from '../../lib/router';
import { Button } from '../ui/Button';
import { CLINIC_IMAGES } from '../../lib/config';
import { Calendar, ShieldCheck, Clock, Award, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Accepting New Patients & Emergency Cases</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1] text-balance">
              Gentle, modern dentistry designed around your complete peace of mind.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
              Experience pain-free treatments with low-radiation digital scans, comforting private suites, and top-tier restorative dentists. Schedule online in under two minutes with instant slot confirmation.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/book')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md px-6"
                leftIcon={<Calendar className="w-5 h-5" />}
              >
                Book Appointment Online
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/services')}
                className="px-6"
              >
                View Treatments & Fees
              </Button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Real-Time Calendar Slots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  4.9/5 (680+ reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-neutral-800 aspect-16/10 lg:aspect-4/3 group">
              <img
                src={CLINIC_IMAGES.hero}
                alt="BrightSmile Dental reception and modern surgical operatory suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent" />

              {/* Floating feature badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800 shadow-lg text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        Top Dental Clinic 2026
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Recognized for Minimally Invasive Dentistry
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-teal-700 dark:text-teal-300">
                    ADA Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
