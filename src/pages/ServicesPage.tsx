import React, { useState } from 'react';
import { useClinicStore } from '../store/useClinicStore';
import { useRouter } from '../lib/router';
import { formatCurrency } from '../lib/utils';
import { CLINIC_IMAGES } from '../lib/config';
import { Button } from '../components/ui/Button';
import { Clock, ShieldCheck, Check, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, clinicConfig } = useClinicStore();
  const { navigate } = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Cosmetic', 'Restorative', 'Orthodontics', 'Surgical'];

  const filtered = services
    .filter((s) => s.active)
    .filter((s) => activeCategory === 'All' || s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Clinical Treatments & Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight text-balance">
          Comprehensive dental treatments with visual procedure previews.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          From preventative hygiene cleanings to high-precision restorative and orthodontic smile corrections. Explore each procedure with clear descriptions, treatment imagery, and guaranteed upfront fees.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-teal-950 font-bold'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services List with Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((service) => {
          const imgSrc = service.imageUrl || CLINIC_IMAGES.suite;

          return (
            <div
              key={service.id}
              className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Treatment Image Container */}
                <div className="relative aspect-16/9 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={imgSrc}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-neutral-900/80 text-teal-300 backdrop-blur-md border border-neutral-700/50">
                      {service.category} Dentistry
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-white bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-700/50 font-mono">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{service.durationMinutes} Min</span>
                    </div>
                  </div>

                  {/* Title overlay on bottom edge */}
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <h2 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                      {service.name}
                    </h2>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-6 pt-4 space-y-3">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>HD Digital Diagnostic Scans</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Comfort Padded Operatory Chair</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom fee & booking CTA */}
              <div className="p-6 pt-0 mt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="pt-4">
                  <span className="text-[11px] text-neutral-400 block font-medium">Standard Out-of-Pocket</span>
                  <span className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 font-mono">
                    {formatCurrency(service.price, clinicConfig.currencySymbol)}
                  </span>
                </div>

                <div className="pt-4">
                  <Button
                    size="md"
                    onClick={() => navigate('/book', { service: service.id })}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  >
                    Schedule This Visit
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insurance guarantee banner */}
      <div className="p-8 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Insurance & Financing Support</span>
          </div>
          <h3 className="text-xl font-bold">Have Dental Insurance or HSA / FSA Benefits?</h3>
          <p className="text-xs text-neutral-300 max-w-xl">
            We work with Delta Dental, MetLife, Cigna, Aetna, Guardian, and Humana. Our front office handles all direct claim submissions so you receive maximum insurance reimbursement.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => navigate('/book')}
          className="bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold shrink-0"
        >
          Check Live Slot Times
        </Button>
      </div>
    </div>
  );
};
