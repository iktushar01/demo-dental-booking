import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { Dentist } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit2, Clock, Calendar, Check, Award } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDentists: React.FC = () => {
  const { dentists, updateDentist, addDentist } = useClinicStore();

  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('DDS');
  const [formSpecialty, setFormSpecialty] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formEducation, setFormEducation] = useState('');
  const [formExperience, setFormExperience] = useState(10);
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStartHour, setFormStartHour] = useState('09:00');
  const [formEndHour, setFormEndHour] = useState('17:00');
  const [formWorkingDays, setFormWorkingDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const daysList = [
    { num: 1, label: 'Mon' },
    { num: 2, label: 'Tue' },
    { num: 3, label: 'Wed' },
    { num: 4, label: 'Thu' },
    { num: 5, label: 'Fri' },
    { num: 6, label: 'Sat' },
  ];

  const handleOpenEdit = (d: Dentist) => {
    setEditingDentist(d);
    setFormName(d.name);
    setFormTitle(d.title);
    setFormSpecialty(d.specialty);
    setFormBio(d.bio);
    setFormEducation(d.education);
    setFormExperience(d.experienceYears);
    setFormEmail(d.email);
    setFormPhone(d.phone);
    setFormStartHour(d.workingHours.start);
    setFormEndHour(d.workingHours.end);
    setFormWorkingDays(d.workingDays);
  };

  const toggleDay = (dayNum: number) => {
    if (formWorkingDays.includes(dayNum)) {
      setFormWorkingDays(formWorkingDays.filter((n) => n !== dayNum));
    } else {
      setFormWorkingDays([...formWorkingDays, dayNum].sort());
    }
  };

  const handleSaveDentist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSpecialty.trim()) {
      toast.error('Dentist name and specialty are required');
      return;
    }

    if (editingDentist) {
      updateDentist(editingDentist.id, {
        name: formName.trim(),
        title: formTitle.trim(),
        specialty: formSpecialty.trim(),
        bio: formBio.trim(),
        education: formEducation.trim(),
        experienceYears: Number(formExperience),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        workingHours: {
          start: formStartHour,
          end: formEndHour,
          lunchBreak: editingDentist.workingHours.lunchBreak,
        },
        workingDays: formWorkingDays,
      });
      toast.success('Dentist profile updated');
      setEditingDentist(null);
    } else {
      const initials = formName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      addDentist({
        name: formName.trim(),
        title: formTitle.trim(),
        specialty: formSpecialty.trim(),
        avatarInitials: initials,
        bio: formBio.trim(),
        education: formEducation.trim(),
        experienceYears: Number(formExperience),
        email: formEmail.trim() || 'dentist@brightsmiledental.com',
        phone: formPhone.trim() || '(555) 234-5678',
        workingHours: {
          start: formStartHour,
          end: formEndHour,
        },
        workingDays: formWorkingDays,
        active: true,
      });
      toast.success('New dentist practitioner added');
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Dentists & Operating Hours
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure clinicians, specialties, weekly shifts, and in-clinic days.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingDentist(null);
            setFormName('');
            setFormTitle('DDS');
            setFormSpecialty('');
            setFormBio('');
            setFormEducation('');
            setFormExperience(8);
            setFormEmail('');
            setFormPhone('');
            setFormStartHour('09:00');
            setFormEndHour('17:00');
            setFormWorkingDays([1, 2, 3, 4, 5]);
            setIsAddOpen(true);
          }}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Dentist
        </Button>
      </div>

      {/* Dentist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dentists.map((dentist) => (
          <div
            key={dentist.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              dentist.active
                ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                : 'border-neutral-200/50 bg-neutral-100/50 dark:bg-neutral-900/40 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
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

                <button
                  onClick={() =>
                    updateDentist(dentist.id, { active: !dentist.active })
                  }
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    dentist.active
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}
                >
                  {dentist.active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    {dentist.workingHours.start} – {dentist.workingHours.end}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">Working Days:</span>
                  <div className="flex items-center gap-1">
                    {daysList.map((d) => {
                      const works = dentist.workingDays.includes(d.num);
                      return (
                        <span
                          key={d.num}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            works
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        >
                          {d.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-500 mt-3 line-clamp-2">
                {dentist.bio}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(dentist)}
                leftIcon={<Edit2 className="w-3 h-3" />}
              >
                Edit Schedule & Info
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={!!editingDentist || isAddOpen}
        onClose={() => {
          setEditingDentist(null);
          setIsAddOpen(false);
        }}
        title={editingDentist ? `Edit Dr. ${editingDentist.name}` : 'Add New Dentist'}
        description="Changes to hours and working days immediately update live booking slot availability."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveDentist} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Doctor Name"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Marcus Vance"
            />
            <Input
              label="Degree / Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. DMD, MS"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Specialty"
              required
              value={formSpecialty}
              onChange={(e) => setFormSpecialty(e.target.value)}
              placeholder="e.g. Orthodontics & Implants"
            />
            <Input
              label="Experience (Years)"
              type="number"
              value={formExperience}
              onChange={(e) => setFormExperience(Number(e.target.value))}
            />
          </div>

          {/* Working Days Selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Weekly In-Clinic Days
            </label>
            <div className="flex items-center gap-1.5">
              {daysList.map((d) => {
                const isSelected = formWorkingDays.includes(d.num);
                return (
                  <button
                    key={d.num}
                    type="button"
                    onClick={() => toggleDay(d.num)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hours range */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Shift Start"
              type="time"
              value={formStartHour}
              onChange={(e) => setFormStartHour(e.target.value)}
            />
            <Input
              label="Shift End"
              type="time"
              value={formEndHour}
              onChange={(e) => setFormEndHour(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Practitioner Bio
            </label>
            <textarea
              rows={2}
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              placeholder="Clinical summary and credentials..."
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingDentist(null);
                setIsAddOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Doctor Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
