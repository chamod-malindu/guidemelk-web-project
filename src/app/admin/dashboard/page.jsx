import AuthWrapper from '@/components/AuthWrapper';
import React from 'react'

function AdminDashBoard() {
  return (
    <AuthWrapper requiredRole="admin">
    <div>Admin</div>
    </AuthWrapper>
  )
}

export default AdminDashBoard;