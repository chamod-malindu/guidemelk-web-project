export function redirectByRole(router, role) {
  switch (role) {
    case "tourist":
      router.replace("/tourist");
      break;
    case "guide":
      router.replace("/guide/dashboard");
      break;
    case "admin":
      router.replace("/admin/dashboard");
      break;
    default:
      router.replace("/login");
  }
}
