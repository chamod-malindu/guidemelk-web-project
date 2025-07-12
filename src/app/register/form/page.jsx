import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";
import RegisterFormClient from "./RegisterFormClient";

export default async function RegisterFormPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    const user = getUserFromToken(token);
    if (user?.role) {
      redirect(`/${user.role}/dashboard`);
    }
  }

  return <RegisterFormClient />;
}
