import { cookies } from "next/headers";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  /*
  if (token) {
    const user = getUserFromToken(token);
    if (user?.role) {
      // Redirect to correct dashboard based on user role
      redirect(`/${user.role}/dashboard`);
    }
  }
  */
  return <RegisterClient />;
}
