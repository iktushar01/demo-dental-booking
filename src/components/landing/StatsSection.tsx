import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { value: '14,200+', label: 'Patients Treated', description: 'Across Greater Portland & Pacific NW' },
    { value: '99.4%', label: 'On-Time Appointments', description: 'Zero waiting room delays' },
    { value: '100%', label: 'Digital Low-Dose Scans', description: '85% reduced x-ray exposure' },
    { value: '4.9 ★', label: 'Average Patient Score', description: 'Verified Google & Healthgrades' },
  ];

  return (
    <section className="border-y border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-left">
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight font-mono tabular-nums">
                {stat.value}
              </p>
              <h4 className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400 mt-1">
                {stat.label}
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
