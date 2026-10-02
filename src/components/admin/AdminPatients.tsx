import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { Patient, Appointment } from '../../types';
import { formatDateSafe, formatCurrency, getStatusDetails } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, User, Phone, Mail, Calendar, Plus, FileText, History } from 'lucide-react';
import { toast } from 'sonner';

export const AdminPatients: React.FC = () => {
  const { patients, appointments, services, dentists, updatePatient, addPatient, clinicConfig } = useClinicStore();

  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientNote, setPatientNote] = useState('');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  // New patient state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const patientVisits = selectedPatient
    ? appointments.filter(
        (a) =>
          a.patientEmail.toLowerCase() === selectedPatient.email.toLowerCase() ||
          a.patientId === selectedPatient.id
      )
    : [];

  const handleSaveNotes = () => {
    if (!selectedPatient) return;
    updatePatient(selectedPatient.id, { notes: patientNote });
    toast.success('Clinical chart notes updated');
    setSelectedPatient((prev) => (prev ? { ...prev, notes: patientNote } : null));
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Patient name and email are required');
      return;
    }

    addPatient({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '(555) 000-0000',
      dateOfBirth: newDob || undefined,
      notes: newNotes.trim() || undefined,
    });

    toast.success('Patient record added');
    setIsAddPatientOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Patient Registry
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {patients.length} active registered clinical patient charts.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddPatientOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Patient Record
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or telephone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const visits = appointments.filter(
            (a) =>
              a.patientEmail.toLowerCase() === patient.email.toLowerCase() ||
              a.patientId === patient.id
          );

          return (
            <div
              key={patient.id}
              onClick={() => {
                setSelectedPatient(patient);
                setPatientNote(patient.notes || '');
              }}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-teal-500/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                    {patient.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {visits.length} Visits
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {patient.name}
                </h3>

                <div className="space-y-1 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>{patient.phone}</span>
                  </div>
                </div>

                {patient.notes && (
                  <p className="mt-3 text-[11px] text-neutral-600 dark:text-neutral-300 line-clamp-2 bg-neutral-50 dark:bg-neutral-850 p-2 rounded-lg italic">
                    "{patient.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-end">
                <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  View Chart & History →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Detail & Visit History Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={`Patient Chart: ${selectedPatient?.name}`}
        description={`Record Created: ${selectedPatient?.createdAt}`}
        maxWidth="xl"
      >
        {selectedPatient && (
          <div className="space-y-5 text-xs text-left">
            {/* Contact details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800">
              <div>
                <span className="text-neutral-400 block font-medium">Email</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {selectedPatient.email}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Phone</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {selectedPatient.phone}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">DOB</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {selectedPatient.dateOfBirth || 'Not provided'}
                </span>
              </div>
            </div>

            {/* Clinical chart notes */}
            <div>
              <label className="font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                Clinical Health Notes & Allergies
              </label>
              <textarea
                rows={3}
                value={patientNote}
                onChange={(e) => setPatientNote(e.target.value)}
                placeholder="Record allergies, dental phobias, active treatment plans..."
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
              />
              <div className="flex justify-end mt-1.5">
                <Button size="sm" onClick={handleSaveNotes}>
                  Save Chart Notes
                </Button>
              </div>
            </div>

            {/* Visit History */}
            <div>
              <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-teal-600" />
                <span>Visit History ({patientVisits.length})</span>
              </h4>

              {patientVisits.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {patientVisits.map((v) => {
                    const serv = services.find((s) => s.id === v.serviceId);
                    const doc = dentists.find((d) => d.id === v.dentistId);
                    const status = getStatusDetails(v.status);

                    return (
                      <div
                        key={v.id}
                        className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              {serv?.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {formatDateSafe(v.date)} at {v.startTime} · Dr. {doc?.name.split(' ')[0]}
                          </p>
                        </div>
                        <span className="font-mono font-semibold">
                          {formatCurrency(v.totalAmount, clinicConfig.currencySymbol)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-neutral-400 italic">No recorded past visits yet.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        title="Add New Patient Chart"
        description="Register a new patient profile into the clinic database."
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-left">
          <Input
            label="Full Name"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Rachel Adams"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. rachel@example.com"
            />
            <Input
              label="Phone"
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="e.g. (555) 765-4321"
            />
          </div>

          <Input
            label="Date of Birth"
            type="date"
            value={newDob}
            onChange={(e) => setNewDob(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Initial Clinical Notes
            </label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Allergies, preferences..."
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddPatientOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Patient
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
