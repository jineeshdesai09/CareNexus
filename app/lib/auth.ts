import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "../lib/session";

//Auth

export async function requireAuth() {
  const userId = await getSession();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

// Roles 

export async function requireAdmin() {
  const userId = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { UserID: userId },
  });

  if (!user || user.Role !== "ADMIN") {
    redirect("/login");
  }

  return user;
}

export async function requireDoctor() {
  const userId = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { UserID: userId },
  });

  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  return user;
}

export async function requireReceptionist() {
  const userId = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { UserID: userId },
  });

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  return user;
}

export async function getCurrentUser() {
  const userId = await getSession();

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { UserID: userId },
    select: {
      UserID: true,
      Name: true,
      Email: true,
      Role: true,
    },
  });
}
