import React from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { formatCurrency, formatDateSafe, getStatusDetails } from '../../lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

export const AdminOverview: React.FC = () => {
  const { appointments, patients, services, dentists, clinicConfig } = useClinicStore();

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Stats calculation
  const todayAppts = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');
  const totalRevenue = appointments
    .filter((a) => a.status === 'completed' || a.paymentStatus === 'paid_deposit' || a.paymentStatus === 'paid_in_clinic')
    .reduce((acc, a) => acc + (a.paymentStatus === 'paid_deposit' ? a.depositAmount : a.totalAmount), 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const noShowCount = appointments.filter((a) => a.status === 'no_show').length;
  const noShowRate =
    completedCount + noShowCount > 0
      ? ((noShowCount / (completedCount + noShowCount)) * 100).toFixed(1)
      : '0.0';

  // Booking trend data (last 7 days + next 3 days)
  const chartDays = Array.from({ length: 10 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayAppts = appointments.filter((a) => a.date === dateStr);
    return {
      date: format(d, 'MMM d'),
      bookings: dayAppts.length,
      confirmed: dayAppts.filter((a) => a.status === 'confirmed').length,
    };
  });

  // Services distribution data
  const serviceBreakdown = services.map((s) => ({
    name: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    count: appointments.filter((a) => a.serviceId === s.id).length,
  })).filter((s) => s.count > 0);

  const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#0284c7', '#38bdf8', '#6366f1', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Executive Operations Overview
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Real-time patient bookings, revenue metrics, and practitioner clinical load.
        </p>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Appointments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Today's Visits</span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2">
            {todayAppts.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>On schedule today</span>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>All Bookings</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2">
            {appointments.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-sky-700 dark:text-sky-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% this month</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2">
            {formatCurrency(totalRevenue, clinicConfig.currencySymbol)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Deposits & in-clinic</span>
          </div>
        </div>

        {/* Patients Count */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Patients</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2">
            {patients.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Active records</span>
          </div>
        </div>

        {/* No-show rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>No-Show Rate</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2">
            {noShowRate}%
          </p>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 mt-1">
            <span>Industry avg: 8.5%</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookings over time chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Bookings Volume Timeline
              </h3>
              <p className="text-[11px] text-neutral-400">Past 7 days + 3-day projected schedule</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-teal-600">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Total Bookings
              </span>
              <span className="flex items-center gap-1 text-sky-600">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Confirmed
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
                <Area
                  type="monotone"
                  dataKey="confirmed"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConfirmed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services breakdown chart */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Treatments Breakdown
            </h3>
            <p className="text-[11px] text-neutral-400">Procedures distribution</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {serviceBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {serviceBreakdown.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate text-neutral-700 dark:text-neutral-300">{item.name}</span>
                </span>
                <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Today's Clinical Schedule ({formatDateSafe(todayStr, 'MMMM d, yyyy')})
            </h3>
            <p className="text-[11px] text-neutral-400">
              {todayAppts.length} patient appointments assigned across operatories
            </p>
          </div>
        </div>

        {todayAppts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Procedure</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {todayAppts.map((appt) => {
                  const dentist = dentists.find((d) => d.id === appt.dentistId);
                  const service = services.find((s) => s.id === appt.serviceId);
                  const status = getStatusDetails(appt.status);

                  return (
                    <tr key={appt.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {appt.startTime} – {appt.endTime}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block text-neutral-800 dark:text-neutral-200">
                          {appt.patientName}
                        </span>
                        <span className="text-[11px] text-neutral-400">{appt.patientPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                        {service?.name}
                      </td>
                      <td className="py-3 px-3">
                        Dr. {dentist?.name.split(' ')[0]}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${status.bg} ${status.text} border ${status.border}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {formatCurrency(appt.totalAmount, clinicConfig.currencySymbol)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-neutral-500 py-6 text-center italic">
            No patient appointments scheduled for today.
          </p>
        )}
      </div>
    </div>
  );
};
