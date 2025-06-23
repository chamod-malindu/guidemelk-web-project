"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyReminderPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false)
  const [timer, setTimer] = useState(60)
  const router = useRouter()

  const handleResend = async () => {
    try {
      setResendDisabled(true)
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
        setError('')
        startCountdown()
      } else {
        setError(data.error)
        setMessage('')
        setResendDisabled(false)
      }
    } catch {
      setError('Something went wrong.')
      setResendDisabled(false)
    }
  }

  const startCountdown = () => {
    let countdown = 60
    const interval = setInterval(() => {
      countdown--
      setTimer(countdown)
      if (countdown === 0) {
        clearInterval(interval)
        setResendDisabled(false)
        setTimer(60)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">Email Verification Required</h1>
        <p className="text-gray-600 text-center text-sm">
          Your email must be verified before you can access this page.
        </p>

        <input
          type="email"
          placeholder="Enter your email to resend link"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleResend}
          disabled={resendDisabled}
          className={`w-full py-2 rounded text-white ${
            resendDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {resendDisabled ? `Resend in ${timer}s` : 'Resend Verification Email'}
        </button>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </div>
  )
}
