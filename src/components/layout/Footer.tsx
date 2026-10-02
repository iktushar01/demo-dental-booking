import React from 'react';
import { Link } from '../../lib/router';
import { useClinicStore } from '../../store/useClinicStore';
import { Phone, Mail, MapPin, Clock, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const { clinicConfig } = useClinicStore();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand & Tagline */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              BS
            </div>
            <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {clinicConfig.name}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {clinicConfig.tagline}
          </p>
          <div className="pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Emergency: {clinicConfig.emergencyPhone}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/services" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Treatments & Pricing
              </Link>
            </li>
            <li>
              <Link to="/dentists" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Our Dentists & Team
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-teal-600 dark:text-teal-400">
                Book an Appointment
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Patient Portal Login
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Staff & Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Hours */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            Operating Hours
          </h4>
          <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 mt-0.5 text-neutral-400 shrink-0" />
              <div>
                <p className="font-medium text-neutral-700 dark:text-neutral-300">Monday – Friday</p>
                <p>8:00 AM – 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 mt-0.5 text-neutral-400 shrink-0" />
              <div>
                <p className="font-medium text-neutral-700 dark:text-neutral-300">Saturday</p>
                <p>9:00 AM – 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-neutral-400">
              <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <div>
                <p>Sunday: Closed (Emergency on-call)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Location & Contact */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            Clinic Location
          </h4>
          <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                {clinicConfig.address}<br />
                {clinicConfig.city}, {clinicConfig.state} {clinicConfig.postalCode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{clinicConfig.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{clinicConfig.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} {clinicConfig.name}. All rights reserved.</p>
        <p className="text-center sm:text-right">
          HIPAA Compliant Data Standards · ADA Member Practice
        </p>
      </div>
    </footer>
  );
};
