import React, { Suspense } from 'react'
import VerifyEmailClient from './VerifyEmailClient'

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <VerifyEmailClient />
    </Suspense>
  )
}
