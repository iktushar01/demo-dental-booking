import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { formatDateSafe } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Calendar, Clock, Plus, Trash2, Ban, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAvailability: React.FC = () => {
  const {
    dentists,
    blockedSlots,
    clinicHolidays,
    addBlockedSlot,
    deleteBlockedSlot,
    addHoliday,
    deleteHoliday,
  } = useClinicStore();

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  // Block slot form
  const [blockDentistId, setBlockDentistId] = useState<string>('all');
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockStartTime, setBlockStartTime] = useState('13:00');
  const [blockEndTime, setBlockEndTime] = useState('17:00');
  const [blockReason, setBlockReason] = useState('');

  // Holiday form
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');

  const handleCreateBlockedSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockStartTime || !blockEndTime) {
      toast.error('Date and time range required');
      return;
    }

    addBlockedSlot({
      dentistId: blockDentistId === 'all' ? undefined : blockDentistId,
      date: blockDate,
      startTime: blockStartTime,
      endTime: blockEndTime,
      reason: blockReason.trim() || 'Internal Clinic Hold',
    });

    toast.success('Availability block placed. Booking engine updated.');
    setIsBlockModalOpen(false);
    setBlockReason('');
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayDate || !holidayName.trim()) {
      toast.error('Holiday date and title are required');
      return;
    }

    addHoliday({
      date: holidayDate,
      name: holidayName.trim(),
    });

    toast.success('Clinic holiday scheduled. Online booking disabled for that date.');
    setIsHolidayModalOpen(false);
    setHolidayDate('');
    setHolidayName('');
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Clinic Availability & Closures
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Custom schedule blocks and recognized holidays immediately disable public booking slots.
        </p>
      </div>

      {/* Grid of 2 sections: Blocked Intervals & Official Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Section 1: Blocked Slots */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Blocked Time Ranges</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Doctor training, surgical room maintenance, or meetings
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsBlockModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Block Slot
            </Button>
          </div>

          {blockedSlots.length > 0 ? (
            <div className="space-y-2.5">
              {blockedSlots.map((block) => {
                const dentist = dentists.find((d) => d.id === block.dentistId);
                const scope = block.dentistId && block.dentistId !== 'all' ? `Dr. ${dentist?.name}` : 'Entire Clinic';

                return (
                  <div
                    key={block.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatDateSafe(block.date)}
                        </span>
                        <span className="font-mono text-neutral-500">
                          {block.startTime} – {block.endTime}
                        </span>
                      </div>
                      <p className="text-teal-700 dark:text-teal-400 font-medium text-[11px] mt-0.5">
                        Scope: {scope}
                      </p>
                      <p className="text-neutral-500 mt-1 italic">
                        "{block.reason}"
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        deleteBlockedSlot(block.id);
                        toast.success('Block removed');
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                      title="Remove Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic py-4 text-center">
              No active blocked slots scheduled.
            </p>
          )}
        </div>

        {/* Section 2: Clinic Holidays */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Clinic Holidays (Full Day Closed)</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Official holiday closures & annual clinic shut-downs
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsHolidayModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Holiday
            </Button>
          </div>

          {clinicHolidays.length > 0 ? (
            <div className="space-y-2.5">
              {clinicHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {holiday.name}
                    </h4>
                    <p className="text-neutral-500 font-mono text-[11px] mt-0.5">
                      {formatDateSafe(holiday.date, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      deleteHoliday(holiday.id);
                      toast.success('Holiday removed');
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                    title="Remove Holiday"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic py-4 text-center">
              No official holidays recorded.
            </p>
          )}
        </div>
      </div>

      {/* Add Block Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Block Calendar Hours"
        description="Prevent online or walk-in appointments for specific doctors or whole office."
      >
        <form onSubmit={handleCreateBlockedSlot} className="space-y-4 text-left">
          <Select
            label="Target Scope"
            value={blockDentistId}
            onChange={(e) => setBlockDentistId(e.target.value)}
          >
            <option value="all">Entire Clinic (All Operatories)</option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} only
              </option>
            ))}
          </Select>

          <Input
            label="Date to Block"
            type="date"
            required
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Block Start"
              type="time"
              required
              value={blockStartTime}
              onChange={(e) => setBlockStartTime(e.target.value)}
            />
            <Input
              label="Block End"
              type="time"
              required
              value={blockEndTime}
              onChange={(e) => setBlockEndTime(e.target.value)}
            />
          </div>

          <Input
            label="Reason for Hold"
            required
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="e.g. Autoclave inspection, team training"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBlockModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Block
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
        title="Register Clinic Holiday"
        description="Clinic will be closed all day; no booking slots will be generated."
      >
        <form onSubmit={handleCreateHoliday} className="space-y-4 text-left">
          <Input
            label="Holiday Title"
            required
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
            placeholder="e.g. Labor Day"
          />

          <Input
            label="Date"
            type="date"
            required
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsHolidayModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Holiday
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
