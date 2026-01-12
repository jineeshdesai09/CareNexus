"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { createSession } from "../lib/session";

export async function login(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const selectedRole = String(formData.get("role"));

  const user = await prisma.user.findUnique({
    where: { Email: email },
  });

  if (!user) {
    redirect("/login?error=invalid");
  }

  const passwordMatch = await bcrypt.compare(password, user.Password);

  if (!passwordMatch) {
    redirect("/login?error=invalid");
  }

  if (user.Role !== selectedRole) {
    redirect("/login?error=role");
  }

  await createSession(user.UserID);

  if (user.Role === "ADMIN") redirect("/dashboard");
  if (user.Role === "DOCTOR") redirect("/doctor/dashboard");
  if (user.Role === "RECEPTIONIST") redirect("/reception/dashboard");

  redirect("/login");
}
