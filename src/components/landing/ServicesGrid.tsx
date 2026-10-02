import React from 'react';
import { useRouter } from '../../lib/router';
import { useClinicStore } from '../../store/useClinicStore';
import { formatCurrency } from '../../lib/utils';
import { CLINIC_IMAGES } from '../../lib/config';
import { Button } from '../ui/Button';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

export const ServicesGrid: React.FC = () => {
  const { navigate } = useRouter();
  const { services, clinicConfig } = useClinicStore();

  const activeServices = services.filter((s) => s.active);

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Spectrum Dental Care</span>
            </div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1 text-balance">
              Transparent treatments and gentle care.
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xl">
              No surprise fees or ambiguous quotes. Every procedure is visually detailed with duration and pricing listed upfront.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/services')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            All 8 Procedures & Details
          </Button>
        </div>

        {/* Bento Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeServices.map((service, index) => {
            const isFeatured = service.popular || index === 0;
            const imgSrc = service.imageUrl || CLINIC_IMAGES.suite;

            return (
              <div
                key={service.id}
                className={`group rounded-2xl border transition-all duration-200 flex flex-col justify-between text-left overflow-hidden ${
                  isFeatured
                    ? 'border-teal-500/40 bg-white dark:bg-neutral-900 shadow-sm hover:border-teal-500 hover:shadow-md'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Card Thumbnail Image */}
                  <div className="relative aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={imgSrc}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-200 bg-neutral-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-white bg-neutral-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md font-mono">
                        <Clock className="w-3 h-3 text-teal-400" />
                        <span>{service.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pb-0">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {service.name}
                    </h3>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">From</span>
                    <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 font-mono tabular-nums">
                      {formatCurrency(service.price, clinicConfig.currencySymbol)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isFeatured ? 'primary' : 'secondary'}
                    onClick={() => navigate('/book', { service: service.id })}
                    className="text-xs"
                  >
                    Select
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
