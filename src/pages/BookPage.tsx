import React from 'react';
import { BookingFlow } from '../components/booking/BookingFlow';

export const BookPage: React.FC = () => {
  return (
    <div className="py-6 min-h-[80vh]">
      <BookingFlow />
    </div>
  );
};
