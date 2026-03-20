"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Eye, EyeOff, Lock, Key, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function ResetPasswordClient() {
  // Step tracking
  const [step, setStep] = useState(1) // 1 = Verify OTP, 2 = Reset Password
  
  // Form states
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [email, setEmail] = useState("")
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (!emailParam) {
      router.push('/forgot-password')
    } else {
      setEmail(emailParam)
    }
  }, [searchParams, router])

  // Countdown timer effect
  useEffect(() => {
    let interval = null
    
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendTimer, canResend])

  // Step 1: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate OTP
    if (!otp.trim()) {
      setError("Please enter the OTP")
      return
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("OTP verified successfully! Now create your new password.")
        // Move to step 2 after a short delay
        setTimeout(() => {
          setStep(2)
          setSuccess("")
        }, 1500)
      } else {
        setError(data.error || "Invalid OTP. Please try again.")
      }

    } catch (error) {
      console.error('OTP verification error:', error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate password
    if (!newPassword) {
      setError("Please enter a new password")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          newPassword: newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Password reset successful! Redirecting to login...")
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || "Failed to reset password. Please try again.")
      }

    } catch (error) {
      console.error('Reset password error:', error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("New OTP has been sent to your email")
        // Reset to step 1 and clear OTP
        setStep(1)
        setOtp("")
        // Reset timer
        setResendTimer(60)
        setCanResend(false)
      } else {
        setError(data.error || "Failed to resend OTP")
      }

    } catch (error) {
      console.error('Resend OTP error:', error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Navbar />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {step === 1 ? `Enter the OTP sent to ${email}` : "Create your new password"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Forms */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? 'Verify OTP' : 'Reset Password'}
            </CardTitle>
            <CardDescription>
              {step === 1 ? 'Enter the 6-digit OTP sent to your email.' : 'Create a new secure password for your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => router.push('/forgot-password')}>Back</Button>
                  <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                </div>
                <div className="relative">
                  <Input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}</Button>
                </div>
              </form>
            )}
            <div className="mt-4 text-center">
              <Button variant="link" onClick={handleResendOTP} disabled={!canResend || isLoading}>
                {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
