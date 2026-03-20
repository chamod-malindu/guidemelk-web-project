import React, { Suspense } from 'react';
import ChatClient from './ChatClient';

export default function Page() {
  // Wrap the client component in Suspense so client-only hooks like
  // useSearchParams are not executed during server prerendering.
  return (
    <Suspense fallback={<div />}> 
      <ChatClient />
    </Suspense>
  );
}
