import React from 'react';
import { seedTestimonials } from '../../data/seed';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-neutral-100/50 dark:bg-neutral-900/40 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Real Patient Stories
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1 text-balance">
            Over 680 five-star dental reviews
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Read what our patients have to say about our gentle techniques, cozy atmosphere, and friendly team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seedTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-neutral-200 dark:text-neutral-700" />
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {item.patientName}
                  </h4>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400">
                    {item.treatment}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
