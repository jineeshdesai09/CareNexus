import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function DoctorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  // This root layout for /doctor is now plain (no sidebar).
  // The sidebar is in (dashboard)/layout.tsx for other doctor pages.
  return <>{children}</>;
}
