import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { Service } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const AdminServices: React.FC = () => {
  const { services, clinicConfig, updateService, addService, deleteService } = useClinicStore();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Service['category']>('General');
  const [duration, setDuration] = useState(45);
  const [price, setPrice] = useState(120);
  const [description, setDescription] = useState('');

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setDuration(s.durationMinutes);
    setPrice(s.price);
    setDescription(s.description);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Procedure name is required');
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        category,
        durationMinutes: Number(duration),
        price: Number(price),
        description: description.trim(),
      });
      toast.success('Service updated');
      setEditingService(null);
    } else {
      addService({
        name: name.trim(),
        category,
        durationMinutes: Number(duration),
        price: Number(price),
        description: description.trim(),
        active: true,
      });
      toast.success('New dental treatment added');
      setIsAddOpen(false);
    }
  };

  const handleDelete = (id: string, sName: string) => {
    if (window.confirm(`Delete service "${sName}"? Existing appointments remain unaffected.`)) {
      deleteService(id);
      toast.success('Service removed');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Treatment Procedures & Pricing
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage dental catalog, chair duration limits, and billing rates.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingService(null);
            setName('');
            setCategory('General');
            setDuration(45);
            setPrice(120);
            setDescription('');
            setIsAddOpen(true);
          }}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Treatment
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              service.active
                ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                : 'border-neutral-200/50 bg-neutral-100/50 dark:bg-neutral-900/40 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                  {service.category}
                </span>

                <button
                  onClick={() =>
                    updateService(service.id, { active: !service.active })
                  }
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    service.active
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}
                >
                  {service.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {service.name}
              </h3>

              <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.durationMinutes} min</span>
                </div>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(service.price, clinicConfig.currencySymbol)}
                </span>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2">
                {service.description}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(service)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-teal-600 cursor-pointer"
                title="Edit Service"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(service.id, service.name)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-rose-600 cursor-pointer"
                title="Delete Service"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={!!editingService || isAddOpen}
        onClose={() => {
          setEditingService(null);
          setIsAddOpen(false);
        }}
        title={editingService ? `Edit ${editingService.name}` : 'Add New Dental Procedure'}
        description="Duration directly affects available time slots in the booking calendar."
      >
        <form onSubmit={handleSaveService} className="space-y-4 text-left">
          <Input
            label="Service Title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Laser Gum Therapy"
          />

          <Select
            label="Clinical Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="General">General</option>
            <option value="Cosmetic">Cosmetic</option>
            <option value="Restorative">Restorative</option>
            <option value="Orthodontics">Orthodontics</option>
            <option value="Surgical">Surgical</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (Minutes)"
              type="number"
              step={15}
              min={15}
              required
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <Input
              label="Standard Fee ($)"
              type="number"
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Procedure Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical summary for patient review..."
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingService(null);
                setIsAddOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
