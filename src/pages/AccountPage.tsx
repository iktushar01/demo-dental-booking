import React from 'react';
import { AuthGuard } from '../components/layout/AuthGuard';
import { PatientDashboard } from '../components/account/PatientDashboard';

export const AccountPage: React.FC = () => {
  return (
    <AuthGuard allowedRoles={['patient', 'admin']}>
      <PatientDashboard />
    </AuthGuard>
  );
};
