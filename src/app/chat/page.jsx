import ChatClient from './ChatClient';

export default function Page() {
  // This is a Server Component (default). Importing a Client Component
  // (`ChatClient` has "use client") is allowed — Next will hydrate it on the client.
  return <ChatClient />;
}
