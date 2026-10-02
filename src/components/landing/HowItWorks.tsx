import React from 'react';
import { useRouter } from '../../lib/router';
import { Button } from '../ui/Button';
import { Calendar, UserCheck, Stethoscope } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { navigate } = useRouter();

  const steps = [
    {
      step: '01',
      title: 'Pick Treatment & Doctor',
      description: 'Choose your desired dental procedure and select your preferred dentist or choose any available provider.',
      icon: <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      step: '02',
      title: 'Choose Live Slot',
      description: 'Our dynamic calendar checks real-time dentist hours, breaks, and vacations to eliminate double-booking.',
      icon: <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      step: '03',
      title: 'Instant Confirmation & Calendar',
      description: 'Receive instant confirmation, downloadable .ics calendar invite, and automated reminder alerts.',
      icon: <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-neutral-100/50 dark:bg-neutral-900/40 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Frictionless Booking
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1 text-balance">
            How appointment scheduling works
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            No endless phone waiting loops or telephone tags. Everything confirms in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs text-left"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center border border-teal-100 dark:border-teal-900/40">
                  {item.icon}
                </div>
                <span className="text-xl font-bold font-mono text-neutral-300 dark:text-neutral-700">
                  {item.step}
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => navigate('/book')}>
            Schedule Your Visit Today
          </Button>
        </div>
      </div>
    </section>
  );
};
