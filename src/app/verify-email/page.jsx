'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();        // To access URL query parameters
  const token = searchParams.get('token');       // Get the 'token' from the query
  const router = useRouter();                    // For programmatic navigation
  const [status, setStatus] = useState('loading'); // To track the verification status

  useEffect(() => {
    // sends the token to your backend to verify the email
    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        // If the email was already verified earlier
        if (data.alreadyVerified) {
          setStatus('already');
          setTimeout(() => router.push(`/${data.role}-dashboard`), 3000);
        }
        // If email just got verified successfully
        else if (data.success) {
          setStatus('verified');
          setTimeout(() => router.push(`/${data.role}-dashboard`), 3000);
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

  // Render content based on the status
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'verified' && <h1>Email Verified! Redirecting...</h1>}
      {status === 'already' && <h1>Email Already Verified. Redirecting...</h1>}
      {status === 'error' && <h1>Invalid or Expired Verification Link</h1>}
    </div>
  );
}
