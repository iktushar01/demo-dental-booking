import React from 'react';
import { Service, PaymentMethod } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { useClinicStore } from '../../store/useClinicStore';
import { CreditCard, Building2, ShieldCheck, Lock, AlertCircle, Sparkles } from 'lucide-react';

interface StepPaymentProps {
  service: Service;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  cardDetails: {
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    cardName: string;
  };
  onCardChange: (field: string, val: string) => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
  service,
  paymentMethod,
  onSelectPaymentMethod,
  cardDetails,
  onCardChange,
}) => {
  const { clinicConfig } = useClinicStore();

  const depositRate = (clinicConfig.depositPercentage || 20) / 100;
  const depositAmount = Math.round(service.price * depositRate);
  const remainingAmount = service.price - depositAmount;

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Payment & Reservation Option
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Lock in your reserved slot with an online deposit or choose to pay in full at check-in.
        </p>
      </div>

      {/* Demo Simulation Badge */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200">
          <strong className="font-semibold">Demo Mode:</strong> No real payment will be processed or charged. Simulated card numbers work instantly.
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option 1: Deposit */}
        <div
          onClick={() => onSelectPaymentMethod('deposit_online')}
          className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
            paymentMethod === 'deposit_online'
              ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20 dark:border-teal-400'
              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-900/60 px-2 py-0.5 rounded">
              Recommended
            </span>
          </div>

          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Pay {clinicConfig.depositPercentage}% Deposit Now
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Guarantees priority chair reservation. Credited directly to your bill.
          </p>

          <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/80">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono">
              Due now: {formatCurrency(depositAmount, clinicConfig.currencySymbol)}
            </span>
          </div>
        </div>

        {/* Option 2: Pay in Clinic */}
        <div
          onClick={() => onSelectPaymentMethod('pay_at_clinic')}
          className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
            paymentMethod === 'pay_at_clinic'
              ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20 dark:border-teal-400'
              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>

          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Pay In Person at Clinic
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pay with card, insurance, HSA/FSA, or cash when you arrive at reception.
          </p>

          <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/80">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono">
              Due now: $0
            </span>
          </div>
        </div>
      </div>

      {/* Card Form (if deposit selected) */}
      {paymentMethod === 'deposit_online' && (
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Simulated 256-Bit SSL Payment Form</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">TEST CARD OK</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={cardDetails.cardName}
                onChange={(e) => onCardChange('cardName', e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Card Number
              </label>
              <input
                type="text"
                maxLength={19}
                placeholder="4242 •••• •••• 4242"
                value={cardDetails.cardNumber}
                onChange={(e) => onCardChange('cardNumber', e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Expiration (MM/YY)
                </label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="08/28"
                  value={cardDetails.cardExpiry}
                  onChange={(e) => onCardChange('cardExpiry', e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="123"
                  value={cardDetails.cardCvc}
                  onChange={(e) => onCardChange('cardCvc', e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2 text-xs">
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>{service.name} (Estimated Fee)</span>
          <span className="font-mono">{formatCurrency(service.price, clinicConfig.currencySymbol)}</span>
        </div>

        {paymentMethod === 'deposit_online' ? (
          <>
            <div className="flex justify-between text-teal-700 dark:text-teal-300 font-semibold">
              <span>Online Deposit ({clinicConfig.depositPercentage}%)</span>
              <span className="font-mono">
                {formatCurrency(depositAmount, clinicConfig.currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span>Balance Remaining Upon Arrival</span>
              <span className="font-mono">
                {formatCurrency(remainingAmount, clinicConfig.currencySymbol)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-between font-semibold pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span>Total Payable In Clinic</span>
            <span className="font-mono">{formatCurrency(service.price, clinicConfig.currencySymbol)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
