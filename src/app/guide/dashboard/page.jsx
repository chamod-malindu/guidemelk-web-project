import AuthWrapper from '@/components/AuthWrapper';
import React from 'react'

function GuideDashBoard() {
  return (
    <AuthWrapper requiredRole="guide">
    <div>GuideDashBoard</div>
    </AuthWrapper>
  )
}

export default GuideDashBoard;