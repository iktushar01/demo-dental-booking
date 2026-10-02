import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { ReminderRule } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Mail, MessageSquare, Bell, CheckCircle, Edit2, Send, History } from 'lucide-react';
import { toast } from 'sonner';

export const AdminReminders: React.FC = () => {
  const { reminderRules, sentReminders, updateReminderRule } = useClinicStore();

  const [editingRule, setEditingRule] = useState<ReminderRule | null>(null);
  const [templateText, setTemplateText] = useState('');

  const handleOpenEdit = (rule: ReminderRule) => {
    setEditingRule(rule);
    setTemplateText(rule.template);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    updateReminderRule(editingRule.id, { template: templateText });
    toast.success('Reminder template updated');
    setEditingRule(null);
  };

  const handleToggleRule = (id: string, enabled: boolean) => {
    updateReminderRule(id, { enabled });
    toast.success(`Reminder rule ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Automated Patient Reminders
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure notification dispatch rules, custom copy variables, and review sent message receipts.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Active Notification Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reminderRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                rule.enabled
                  ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs'
                  : 'border-neutral-200/50 bg-neutral-100/50 dark:bg-neutral-900/40 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                      {rule.channel === 'email' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                      {rule.channel.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      rule.enabled
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Paused'}
                  </button>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {rule.name}
                </h4>

                <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono">
                  "{rule.template}"
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(rule)}
                  leftIcon={<Edit2 className="w-3 h-3" />}
                >
                  Edit Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sent Reminders Log Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <History className="w-4 h-4 text-teal-600" />
              <span>Dispatched Reminders Audit Trail</span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Mock log of recent transactional email and SMS reminders
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {sentReminders.length} dispatched
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Booking Code</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Recipient</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {sentReminders.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-850">
                  <td className="py-2.5 px-3 font-mono font-bold">{log.bookingCode}</td>
                  <td className="py-2.5 px-3 font-semibold">{log.patientName}</td>
                  <td className="py-2.5 px-3">
                    <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                      {log.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-500 font-mono">{log.recipient}</td>
                  <td className="py-2.5 px-3 text-neutral-500">{log.sentAt}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                      <CheckCircle className="w-3 h-3" /> Delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Template Modal */}
      <Modal
        isOpen={!!editingRule}
        onClose={() => setEditingRule(null)}
        title="Edit Reminder Copy Template"
        description="Supported dynamic placeholders: {{patient_name}}, {{dentist_name}}, {{service_name}}, {{date}}, {{time}}."
      >
        <form onSubmit={handleSaveTemplate} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Message Content
            </label>
            <textarea
              rows={4}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingRule(null)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Template
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
