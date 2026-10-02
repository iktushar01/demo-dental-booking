import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { Appointment, AppointmentStatus, Dentist, Service } from '../../types';
import { formatDateSafe, formatCurrency, getStatusDetails, getPaymentBadgeDetails, downloadTextFile } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Ban,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminAppointments: React.FC = () => {
  const {
    appointments,
    dentists,
    services,
    clinicConfig,
    updateAppointment,
    addAppointment,
    deleteAppointment,
    cancelAppointment,
  } = useClinicStore();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDentist, setFilterDentist] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'patient'>('date_desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Manual Add Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newDentistId, setNewDentistId] = useState(dentists[0]?.id || '');
  const [newServiceId, setNewServiceId] = useState(services[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newNotes, setNewNotes] = useState('');

  // Filter logic
  const filtered = appointments
    .filter((a) => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterDentist !== 'all' && a.dentistId !== filterDentist) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          a.patientName.toLowerCase().includes(query) ||
          a.patientEmail.toLowerCase().includes(query) ||
          a.bookingCode.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return (b.date + b.startTime).localeCompare(a.date + a.startTime);
      if (sortBy === 'date_asc') return (a.date + a.startTime).localeCompare(b.date + b.startTime);
      if (sortBy === 'patient') return a.patientName.localeCompare(b.patientName);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const headers = ['Booking Code,Patient Name,Email,Phone,Dentist,Service,Date,Start Time,End Time,Status,Total Amount'];
    const rows = filtered.map((a) => {
      const d = dentists.find((x) => x.id === a.dentistId)?.name || 'Unknown';
      const s = services.find((x) => x.id === a.serviceId)?.name || 'Unknown';
      return `"${a.bookingCode}","${a.patientName}","${a.patientEmail}","${a.patientPhone}","${d}","${s}","${a.date}","${a.startTime}","${a.endTime}","${a.status}","${a.totalAmount}"`;
    });
    const csvContent = [headers, ...rows].join('\n');
    downloadTextFile(csvContent, `appointments-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success(`Exported ${filtered.length} appointments to CSV`);
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    updateAppointment(id, { status });
    toast.success(`Status updated to ${status}`);
    if (selectedAppt?.id === id) {
      setSelectedAppt((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleCreateManualAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientEmail.trim()) {
      toast.error('Patient name and email are required');
      return;
    }

    const selectedServ = services.find((s) => s.id === newServiceId) || services[0];
    const duration = selectedServ.durationMinutes || 45;

    // Calculate end time
    const [h, m] = newStartTime.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
    const endM = String(endMinutes % 60).padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    addAppointment({
      bookingCode: `BS-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: `manual-${Date.now()}`,
      patientName: newPatientName.trim(),
      patientEmail: newPatientEmail.trim(),
      patientPhone: newPatientPhone.trim() || '(555) 000-0000',
      dentistId: newDentistId,
      serviceId: newServiceId,
      date: newDate,
      startTime: newStartTime,
      endTime,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentMethod: 'pay_at_clinic',
      depositAmount: 0,
      totalAmount: selectedServ.price,
      notes: newNotes.trim() || undefined,
    });

    toast.success('Appointment manually created');
    setIsAddModalOpen(false);
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Appointment Records
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {appointments.length} total scheduled, completed, and pending patient procedures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search patient name, email, or booking code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs p-1.5 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-Show</option>
          </select>

          <select
            value={filterDentist}
            onChange={(e) => {
              setFilterDentist(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs p-1.5 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
          >
            <option value="all">All Dentists</option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs p-1.5 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
          >
            <option value="date_desc">Latest Date First</option>
            <option value="date_asc">Earliest Date First</option>
            <option value="patient">Patient Name</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {paginated.map((appt) => {
                const dentist = dentists.find((d) => d.id === appt.dentistId);
                const service = services.find((s) => s.id === appt.serviceId);
                const status = getStatusDetails(appt.status);
                const payment = getPaymentBadgeDetails(appt.paymentStatus);

                return (
                  <tr
                    key={appt.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {appt.bookingCode}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                        {appt.patientName}
                      </span>
                      <span className="text-[11px] text-neutral-400">{appt.patientEmail}</span>
                    </td>

                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                      {service?.name || 'Procedure'}
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      Dr. {dentist?.name.split(' ')[0]}
                    </td>

                    <td className="py-3 px-4">
                      <span className="block font-medium text-neutral-800 dark:text-neutral-200">
                        {formatDateSafe(appt.date, 'MMM d, yyyy')}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {appt.startTime} – {appt.endTime}
                      </span>
                    </td>

                    {/* Inline Status Select */}
                    <td className="py-3 px-4">
                      <select
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value as AppointmentStatus)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${status.bg} ${status.text} ${status.border} cursor-pointer focus:outline-none`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No-Show</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono block">
                        {formatCurrency(appt.totalAmount, clinicConfig.currencySymbol)}
                      </span>
                      <span className="text-[10px] text-neutral-400">{payment.label}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAppt(appt)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-teal-600 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${appt.patientName}?`)) {
                              deleteAppointment(appt.id);
                              toast.success('Appointment deleted');
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Details Drawer Modal */}
      <Modal
        isOpen={!!selectedAppt}
        onClose={() => setSelectedAppt(null)}
        title="Appointment Record Details"
        description={`Booking Reference: ${selectedAppt?.bookingCode}`}
        maxWidth="lg"
      >
        {selectedAppt && (
          <div className="space-y-4 text-xs text-left">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800">
              <div>
                <span className="text-neutral-400 block">Patient Name</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedAppt.patientName}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Contact</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedAppt.patientPhone} · {selectedAppt.patientEmail}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Procedure</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {services.find((s) => s.id === selectedAppt.serviceId)?.name}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Practitioner</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Dr. {dentists.find((d) => d.id === selectedAppt.dentistId)?.name}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Date & Time</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatDateSafe(selectedAppt.date)} at {selectedAppt.startTime} – {selectedAppt.endTime}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Financials</span>
                <span className="font-semibold font-mono text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(selectedAppt.totalAmount, clinicConfig.currencySymbol)} (Deposit: {formatCurrency(selectedAppt.depositAmount, clinicConfig.currencySymbol)})
                </span>
              </div>
            </div>

            {selectedAppt.notes && (
              <div>
                <span className="text-neutral-400 font-semibold block mb-1">Clinical Notes</span>
                <p className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {selectedAppt.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[11px] text-neutral-400">
                Created: {formatDateSafe(selectedAppt.createdAt)}
              </span>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleStatusChange(selectedAppt.id, 'completed');
                    setSelectedAppt(null);
                  }}
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    cancelAppointment(selectedAppt.id, 'Cancelled by Clinic Administration');
                    toast.success('Appointment cancelled');
                    setSelectedAppt(null);
                  }}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Patient Appointment"
        description="Manually create an appointment reservation directly into the calendar."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateManualAppt} className="space-y-4 text-left">
          <Input
            label="Patient Name"
            required
            value={newPatientName}
            onChange={(e) => setNewPatientName(e.target.value)}
            placeholder="e.g. Samuel Wilson"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Patient Email"
              type="email"
              required
              value={newPatientEmail}
              onChange={(e) => setNewPatientEmail(e.target.value)}
              placeholder="e.g. samuel@example.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={newPatientPhone}
              onChange={(e) => setNewPatientPhone(e.target.value)}
              placeholder="e.g. (555) 321-7654"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Dentist"
              value={newDentistId}
              onChange={(e) => setNewDentistId(e.target.value)}
            >
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} ({d.specialty})
                </option>
              ))}
            </Select>

            <Select
              label="Service"
              value={newServiceId}
              onChange={(e) => setNewServiceId(e.target.value)}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (${s.price} · {s.durationMinutes}m)
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              label="Start Time"
              type="time"
              required
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Internal / Patient Notes
            </label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Walk-in emergency appointment..."
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm & Book
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
