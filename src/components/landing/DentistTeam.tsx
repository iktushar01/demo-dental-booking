import React from 'react';
import { useRouter } from '../../lib/router';
import { useClinicStore } from '../../store/useClinicStore';
import { Button } from '../ui/Button';
import { Award, GraduationCap, Calendar, ArrowRight } from 'lucide-react';

export const DentistTeam: React.FC = () => {
  const { navigate } = useRouter();
  const { dentists } = useClinicStore();

  const activeDentists = dentists.filter((d) => d.active);

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Expert Clinical Team
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1 text-balance">
              Compassionate doctors with specialized mastery.
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xl">
              From restorative care to orthodontics and cosmetic smile makeovers, our clinicians combine gentle bedside manner with technical precision.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dentists')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Dentist Profiles & Bio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeDentists.map((dentist) => (
            <div
              key={dentist.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between text-left group"
            >
              <div>
                {/* Photo container */}
                <div className="aspect-4/3 overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                  {dentist.avatarUrl ? (
                    <img
                      src={dentist.avatarUrl}
                      alt={`Portrait of Dr. ${dentist.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-neutral-400">
                      {dentist.avatarInitials}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60">
                    {dentist.experienceYears}+ yrs exp
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-400 font-medium mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{dentist.specialty}</span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Dr. {dentist.name}, <span className="text-neutral-500 font-normal text-sm">{dentist.title}</span>
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{dentist.education}</span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
                    {dentist.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  className="w-full justify-center"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/book', { dentist: dentist.id })}
                  leftIcon={<Calendar className="w-3.5 h-3.5 text-teal-600" />}
                >
                  Book with Dr. {dentist.name.split(' ')[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
