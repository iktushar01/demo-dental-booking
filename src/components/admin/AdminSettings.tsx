import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RotateCcw, Building, ShieldCheck, Sun, Moon, Monitor, Check } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const { clinicConfig, updateClinicConfig, resetDemoData } = useClinicStore();
  const { theme, setTheme } = useThemeStore();

  const [formConfig, setFormConfig] = useState(clinicConfig);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicConfig(formConfig);
    toast.success('Clinic practice settings saved successfully');
  };

  const handleResetData = () => {
    resetDemoData();
    setFormConfig(useClinicStore.getState().clinicConfig);
    setIsResetConfirmOpen(false);
    toast.success('Demo data restored to initial pristine seed state');
  };

  return (
    <div className="space-y-8 text-left max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Practice Settings & Policies
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          General clinic branding, contact channels, deposit percentages, and demo environment reset.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Practice identity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            Practice Identity & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Clinic Name"
              required
              value={formConfig.name}
              onChange={(e) => setFormConfig({ ...formConfig, name: e.target.value })}
            />
            <Input
              label="Tagline"
              value={formConfig.tagline}
              onChange={(e) => setFormConfig({ ...formConfig, tagline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Reception Phone"
              value={formConfig.phone}
              onChange={(e) => setFormConfig({ ...formConfig, phone: e.target.value })}
            />
            <Input
              label="Emergency Hot-Line"
              value={formConfig.emergencyPhone}
              onChange={(e) => setFormConfig({ ...formConfig, emergencyPhone: e.target.value })}
            />
            <Input
              label="Contact Email"
              type="email"
              value={formConfig.email}
              onChange={(e) => setFormConfig({ ...formConfig, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                value={formConfig.address}
                onChange={(e) => setFormConfig({ ...formConfig, address: e.target.value })}
              />
            </div>
            <Input
              label="City & State"
              value={`${formConfig.city}, ${formConfig.state}`}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                setFormConfig({
                  ...formConfig,
                  city: parts[0]?.trim() || '',
                  state: parts[1]?.trim() || '',
                });
              }}
            />
          </div>

          <Input
            label="Operating Hours Text"
            value={formConfig.openHoursText}
            onChange={(e) => setFormConfig({ ...formConfig, openHoursText: e.target.value })}
          />
        </div>

        {/* Financial & Cancellation Policies */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            Booking & Reservation Financial Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Currency Symbol"
              value={formConfig.currencySymbol}
              onChange={(e) => setFormConfig({ ...formConfig, currencySymbol: e.target.value })}
            />
            <Input
              label="Deposit Percentage (%)"
              type="number"
              min={0}
              max={100}
              value={formConfig.depositPercentage}
              onChange={(e) => setFormConfig({ ...formConfig, depositPercentage: Number(e.target.value) })}
            />
            <Input
              label="Cancellation Window (Hours)"
              type="number"
              min={1}
              value={formConfig.cancellationNoticeHours}
              onChange={(e) => setFormConfig({ ...formConfig, cancellationNoticeHours: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Theme mode preference */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            System Theme Preference
          </h3>
          <p className="text-xs text-neutral-500">
            Choose your preferred aesthetic mode across the portal and administration panel.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border cursor-pointer ${
                theme === 'light'
                  ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light Mode
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border cursor-pointer ${
                theme === 'dark'
                  ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark Mode
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border cursor-pointer ${
                theme === 'system'
                  ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> System Default
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Practice Settings</Button>
        </div>
      </form>

      {/* Danger Zone: Reset Demo Data */}
      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </h3>
        <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
          Restores seed dentists, 8 standard procedures, sample patient appointments, and holidays. Any custom appointments created during this test session will be overwritten.
        </p>

        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            if (window.confirm('Reset all demo data back to default factory seeds?')) {
              handleResetData();
            }
          }}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Demo Data to Seed
        </Button>
      </div>
    </div>
  );
};
