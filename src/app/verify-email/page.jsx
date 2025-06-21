'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();        // To access URL query parameters
  const token = searchParams.get('token');       // Get the 'token' from the query
  const router = useRouter();                    // For programmatic navigation
  const [status, setStatus] = useState('loading'); // To track the verification status
  const [countdown, setCountdown] = useState(3); 

  useEffect(() => {
    // sends the token to your backend to verify the email
    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (data.alreadyVerified) {
          setStatus('already');
          startCountdown(data.role); // Start countdown if already verified
          
        } else if (data.success) {
          setStatus('verified');
          startCountdown(data.role); // Start countdown if newly verified
        }
        
        // If backend returns an unexpected structure
        else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }

    // Start the verification only if token is present
    if (token) verify();
    else setStatus('error');  // No token-invalid access
  }, [token, router]);

  // Starts the countdown and redirects after 3 seconds
  function startCountdown(role) {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          router.push(`/${role}-dashboard`);
        }
        return prev - 1;
      });
    }, 1000);
  }
  

  // Render content based on the status
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'verified' && (
      <>
        <h1>Email Verified!</h1>
        <p>Redirecting in {countdown} second{countdown !== 1 && 's'}...</p>
      </>
      )}

      {status === 'already' && (
      <>
        <h1>Email Already Verified</h1>
        <p>Redirecting in {countdown} second{countdown !== 1 && 's'}...</p>
      </>
      )}

      {status === 'error' && <h1>Invalid or Expired Verification Link</h1>}
    </div>
  );
}
