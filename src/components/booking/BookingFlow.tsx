import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { useClinicStore } from '../../store/useClinicStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Dentist, Service, Appointment, PaymentMethod } from '../../types';
import { generateBookingCode } from '../../lib/utils';
import { GeneratedTimeSlot } from '../../lib/slots';
import { StepService } from './StepService';
import { StepDentist } from './StepDentist';
import { StepDateTime } from './StepDateTime';
import { StepPatientDetails, PatientFormData } from './StepPatientDetails';
import { StepPayment } from './StepPayment';
import { StepConfirmation } from './StepConfirmation';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, Check, Calendar, Stethoscope, User, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export const BookingFlow: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const { services, dentists, addAppointment, clinicConfig } = useClinicStore();
  const { currentUser } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Booking selections state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [isAnyDentist, setIsAnyDentist] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<GeneratedTimeSlot | null>(null);

  // Patient details state
  const [patientData, setPatientData] = useState<PatientFormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    notes: '',
  });
  const [patientErrors, setPatientErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('deposit_online');
  const [cardDetails, setCardDetails] = useState({
    cardName: currentUser?.name || 'Alex Morgan',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
  });

  // Confirmed appointment result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Initialize from query parameters if present
  useEffect(() => {
    const serviceParam = queryParams.get('service');
    if (serviceParam) {
      const match = services.find((s) => s.id === serviceParam);
      if (match) setSelectedService(match);
    } else if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }

    const dentistParam = queryParams.get('dentist');
    if (dentistParam) {
      const match = dentists.find((d) => d.id === dentistParam);
      if (match) {
        setSelectedDentist(match);
        setIsAnyDentist(false);
      }
    }
  }, [queryParams, services, dentists]);

  // Handle patient form validation
  const validatePatientDetails = (): boolean => {
    const errors: Partial<Record<keyof PatientFormData, string>> = {};
    if (!patientData.name.trim()) errors.name = 'Full name is required';
    if (!patientData.email.trim() || !patientData.email.includes('@')) {
      errors.email = 'Please provide a valid email';
    }
    if (!patientData.phone.trim() || patientData.phone.length < 7) {
      errors.phone = 'Valid phone number is required';
    }
    setPatientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedService) {
        toast.error('Please choose a dental service');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate) {
        toast.error('Please select an appointment date');
        return;
      }
      if (!selectedSlot) {
        toast.error('Please select an available appointment time slot');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!validatePatientDetails()) {
        toast.error('Please complete all required contact fields');
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Complete booking
      handleCompleteBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteBooking = () => {
    if (!selectedService || !selectedSlot || !selectedDate) return;

    // Resolve dentist
    let finalDentistId = selectedDentist?.id;
    if (isAnyDentist || !finalDentistId) {
      finalDentistId = selectedSlot.dentistId || dentists[0]?.id || 'dentist-1';
    }

    const depositAmount =
      paymentMethod === 'deposit_online'
        ? Math.round(selectedService.price * ((clinicConfig.depositPercentage || 20) / 100))
        : 0;

    const newAppt = addAppointment({
      bookingCode: generateBookingCode(),
      patientId: currentUser?.id || `guest-${Date.now()}`,
      patientName: patientData.name.trim(),
      patientEmail: patientData.email.trim(),
      patientPhone: patientData.phone.trim(),
      dentistId: finalDentistId,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'deposit_online' ? 'paid_deposit' : 'pending',
      paymentMethod: paymentMethod,
      depositAmount,
      totalAmount: selectedService.price,
      notes: patientData.notes.trim() || undefined,
    });

    setConfirmedAppointment(newAppt);
    setCurrentStep(6);
    toast.success('Appointment booked successfully!');
  };

  const stepLabels = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Dentist' },
    { num: 3, label: 'Date & Time' },
    { num: 4, label: 'Patient Info' },
    { num: 5, label: 'Payment' },
    { num: 6, label: 'Confirmed' },
  ];

  const assignedDentist =
    selectedDentist ||
    (confirmedAppointment
      ? dentists.find((d) => d.id === confirmedAppointment.dentistId)
      : null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Multi-step progress bar */}
      {currentStep < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 overflow-x-auto no-scrollbar pb-1">
            {stepLabels.slice(0, 5).map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div
                  key={step.num}
                  className="flex items-center gap-2 cursor-default select-none shrink-0"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-teal-600 text-white'
                        : isCurrent
                        ? 'bg-teal-600 text-white ring-4 ring-teal-500/20 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      isCurrent
                        ? 'text-teal-700 dark:text-teal-300'
                        : isPast
                        ? 'text-neutral-700 dark:text-neutral-300'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Line indicator */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step View Container */}
      <div className="min-h-[420px]">
        {currentStep === 1 && (
          <StepService
            selectedService={selectedService}
            onSelect={setSelectedService}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <StepDentist
            selectedDentist={selectedDentist}
            isAnyDentist={isAnyDentist}
            onSelectDentist={(dentist, isAny) => {
              setSelectedDentist(dentist);
              setIsAnyDentist(isAny);
            }}
            onNext={handleNext}
          />
        )}

        {currentStep === 3 && selectedService && (
          <StepDateTime
            service={selectedService}
            dentist={selectedDentist}
            isAnyDentist={isAnyDentist}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null); // Reset slot on date change
            }}
            onSelectSlot={setSelectedSlot}
          />
        )}

        {currentStep === 4 && (
          <StepPatientDetails
            formData={patientData}
            onChange={(field, val) => setPatientData((prev) => ({ ...prev, [field]: val }))}
            errors={patientErrors}
          />
        )}

        {currentStep === 5 && selectedService && (
          <StepPayment
            service={selectedService}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            cardDetails={cardDetails}
            onCardChange={(field, val) => setCardDetails((prev) => ({ ...prev, [field]: val }))}
          />
        )}

        {currentStep === 6 && confirmedAppointment && selectedService && (
          <StepConfirmation
            appointment={confirmedAppointment}
            dentist={assignedDentist || undefined}
            service={selectedService}
          />
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      {currentStep < 6 && (
        <div className="mt-8 pt-5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="md"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          <Button
            size="md"
            onClick={handleNext}
            rightIcon={currentStep < 5 ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {currentStep === 5 ? 'Confirm Reservation' : 'Continue'}
          </Button>
        </div>
      )}
    </div>
  );
};
