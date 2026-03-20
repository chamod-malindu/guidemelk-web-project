import { cookies } from "next/headers";
import React, { Suspense } from "react";
import RegisterFormClient from "./RegisterFormClient";

export default async function RegisterFormPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  /*
  if (token) {
    const user = getUserFromToken(token);
    if (user?.role) {
      redirect(`/${user.role}/dashboard`);
    }
  }
  */
  return (
    <Suspense fallback={<div />}>
      <RegisterFormClient />
    </Suspense>
  );
}
