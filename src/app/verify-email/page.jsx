'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Mail, AlertTriangle, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // If no token, this is the "check your email" page
    if (!token) {
      setStatus('waiting');
      return;
    }

    // If token exists, verify the email
    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (data.alreadyVerified) {
          setStatus('already');
          startCountdown(data.role);
        } else if (data.success) {
          setStatus('verified');
          startCountdown(data.role);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }

    verify();
  }, [token]);

  function startCountdown(role) {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          router.push(`/${role}/dashboard`);
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          
          {/* Loading State */}
          {status === 'loading' && (
            <div>
              <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying...</h1>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {/* Waiting for Email Click */}
          {status === 'waiting' && (
            <div>
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h1>
              <p className="text-gray-600 mb-4">
                We've sent a verification link to your email address. Please click the link to verify your account.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  💡 Don't forget to check your spam folder!
                </p>
              </div>
            </div>
          )}

          {/* Success States */}
          {(status === 'verified' || status === 'already') && (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {status === 'verified' ? 'Email Verified!' : 'Already Verified'}
              </h1>
              <p className="text-gray-600 mb-4">
                {status === 'verified' 
                  ? 'Your email has been successfully verified.' 
                  : 'Your email was already verified.'}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div>
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">
                This verification link is invalid or has expired. Please try registering again.
              </p>
              <button
                onClick={() => router.push('/register')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Registration
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}