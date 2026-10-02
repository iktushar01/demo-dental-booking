import React from 'react';
import { AuthGuard } from '../components/layout/AuthGuard';
import { AdminLayout } from '../components/admin/AdminLayout';

export const AdminPage: React.FC = () => {
  return (
    <AuthGuard allowedRoles={['admin']} redirectPath="/login?redirect=/admin">
      <AdminLayout />
    </AuthGuard>
  );
};
