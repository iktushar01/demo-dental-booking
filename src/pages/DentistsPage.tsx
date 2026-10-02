import React from 'react';
import { useClinicStore } from '../store/useClinicStore';
import { useRouter } from '../lib/router';
import { Button } from '../components/ui/Button';
import { Award, GraduationCap, Calendar, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const DentistsPage: React.FC = () => {
  const { dentists } = useClinicStore();
  const { navigate } = useRouter();

  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Our Clinical Practitioners
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight text-balance">
          Experienced doctors dedicated to gentle patient care.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Every dentist on our team completes over 50 hours of annual advanced continuing education in minimally invasive techniques, 3D digital diagnosis, and anxiety-free patient comfort.
        </p>
      </div>

      {/* Dentists Detailed Cards */}
      <div className="space-y-8">
        {dentists.map((dentist) => {
          const workingDaysText = dentist.workingDays
            .map((d) => daysMap[d].slice(0, 3))
            .join(', ');

          return (
            <div
              key={dentist.id}
              className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col lg:flex-row items-start gap-8"
            >
              {/* Doctor Photo */}
              <div className="w-full lg:w-72 aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700 relative">
                {dentist.avatarUrl ? (
                  <img
                    src={dentist.avatarUrl}
                    alt={dentist.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-4xl text-neutral-400">
                    {dentist.avatarInitials}
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200">
                  {dentist.experienceYears}+ Years Exp
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-1 space-y-4 text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{dentist.specialty}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Dr. {dentist.name}, <span className="font-normal text-neutral-500 text-lg">{dentist.title}</span>
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {dentist.bio}
                </p>

                {/* Credentials & Operating Schedule Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-neutral-400 block font-medium">Education & Honors</span>
                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                      <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{dentist.education}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-neutral-400 block font-medium">Clinical Operating Hours</span>
                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-mono">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        {dentist.workingHours.start} – {dentist.workingHours.end} ({workingDaysText})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Button
                    size="md"
                    onClick={() => navigate('/book', { dentist: dentist.id })}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  >
                    Book with Dr. {dentist.name.split(' ')[0]}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/services')}
                  >
                    View Treatments Offered
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
