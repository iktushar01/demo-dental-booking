import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { Service } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { CLINIC_IMAGES } from '../../lib/config';
import { Clock, Check, Search } from 'lucide-react';

interface StepServiceProps {
  selectedService: Service | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
}

export const StepService: React.FC<StepServiceProps> = ({
  selectedService,
  onSelect,
  onNext,
}) => {
  const { services, clinicConfig } = useClinicStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'General', 'Cosmetic', 'Restorative', 'Orthodontics', 'Surgical'];

  const filteredServices = services
    .filter((s) => s.active)
    .filter((s) => selectedCategory === 'All' || s.category === selectedCategory)
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Select Dental Procedure
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Choose the service you would like to schedule today. Pricing and estimated appointment lengths are guaranteed.
        </p>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-teal-950 font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          const imgSrc = service.imageUrl || CLINIC_IMAGES.suite;

          return (
            <div
              key={service.id}
              onClick={() => onSelect(service)}
              className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20 dark:border-teal-400'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex gap-3 mb-2.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700">
                    <img
                      src={imgSrc}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{service.durationMinutes}m</span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {service.name}
                      </h3>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Total Fee</span>
                  <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 font-mono tabular-nums">
                    {formatCurrency(service.price, clinicConfig.currencySymbol)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(service);
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

      {filteredServices.length === 0 && (
        <div className="p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <p className="text-sm text-neutral-500">No services match your search or filter.</p>
        </div>
      )}
    </div>
  );
};
