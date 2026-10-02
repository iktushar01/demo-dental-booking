import React from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { CLINIC_IMAGES } from '../../lib/config';
import { MapPin, Phone, Mail, Clock, ShieldAlert, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../lib/router';

export const ContactSection: React.FC = () => {
  const { clinicConfig } = useClinicStore();
  const { navigate } = useRouter();

  return (
    <section className="py-16 sm:py-20 bg-neutral-100/50 dark:bg-neutral-900/40 border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Contact Info */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Visit & Contact
              </span>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1 text-balance">
                Convenient medical plaza with complimentary parking.
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                Located right off the freeway with dedicated patient bays and elevator access to Suite 400.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Address
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {clinicConfig.address}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {clinicConfig.city}, {clinicConfig.state} {clinicConfig.postalCode} (Free covered parking on level B)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                      Phone & Inquiries
                    </h4>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {clinicConfig.phone}
                    </p>
                    <p className="text-xs text-neutral-400">{clinicConfig.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3.5">
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      24/7 Dental Emergency
                    </h4>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {clinicConfig.emergencyPhone}
                    </p>
                    <p className="text-xs text-neutral-400">On-call dentist pager</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Office Hours
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                    {clinicConfig.openHoursText}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => navigate('/book')} size="md">
                Schedule An Appointment
              </Button>
            </div>
          </div>

          {/* Right: Treatment Suite Image */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-neutral-200/80 dark:border-neutral-800 relative group aspect-4/3">
              <img
                src={CLINIC_IMAGES.suite}
                alt="BrightSmile Operatory Suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium mb-2">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Private Operatory Room 4</span>
                </div>
                <h4 className="text-base font-bold">Ergonomic Memory Foam Care Chairs</h4>
                <p className="text-xs text-neutral-200 mt-0.5">
                  Overhead ceiling screens, warm fleece blankets, and noise-canceling headsets provided for every visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
