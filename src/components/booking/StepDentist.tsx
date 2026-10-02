import React from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { Dentist } from '../../types';
import { Check, Sparkles, Award } from 'lucide-react';

interface StepDentistProps {
  selectedDentist: Dentist | null; // null means 'Any available'
  isAnyDentist: boolean;
  onSelectDentist: (dentist: Dentist | null, isAny: boolean) => void;
  onNext: () => void;
}

export const StepDentist: React.FC<StepDentistProps> = ({
  selectedDentist,
  isAnyDentist,
  onSelectDentist,
  onNext,
}) => {
  const { dentists } = useClinicStore();
  const activeDentists = dentists.filter((d) => d.active);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Select Your Dentist
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Choose a specific doctor or select "Any Available Dentist" for the widest selection of appointment slots.
        </p>
      </div>

      {/* Any Dentist Card */}
      <div
        onClick={() => {
          onSelectDentist(null, true);
        }}
        className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
          isAnyDentist
            ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/40 dark:bg-teal-950/20 dark:border-teal-400'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Any Available Dentist
              </h3>
              <span className="text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-900/80 dark:text-teal-200 px-2 py-0.5 rounded-md font-semibold">
                Fastest Slot
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              We'll assign the doctor with the earliest matching availability.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAnyDentist && (
            <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* Individual Dentists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activeDentists.map((dentist) => {
          const isSelected = !isAnyDentist && selectedDentist?.id === dentist.id;

          return (
            <div
              key={dentist.id}
              onClick={() => onSelectDentist(dentist, false)}
              className={`rounded-2xl border p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between text-left ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20 dark:border-teal-400'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700">
                      {dentist.avatarUrl ? (
                        <img
                          src={dentist.avatarUrl}
                          alt={dentist.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-neutral-400">
                          {dentist.avatarInitials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        Dr. {dentist.name}
                      </h3>
                      <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                        {dentist.specialty}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                  {dentist.bio}
                </p>

                {/* Working Days */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-[10px] text-neutral-400 block mb-1.5 uppercase font-medium tracking-wider">
                    In Clinic Days:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((dayNum) => {
                      const isWorking = dentist.workingDays.includes(dayNum);
                      return (
                        <span
                          key={dayNum}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isWorking
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        >
                          {dayNames[dayNum]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDentist(dentist, false);
                    onNext();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
