"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { getCurrentUser } from "../lib/auth";
import { Role } from "../generated/prisma/enums";

export async function updateUserStatus(userId: number, status: "APPROVED" | "REJECTED") {
  try {
    await prisma.user.update({
      where: { UserID: userId },
      data: { Status: status },
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function createStaff(formData: FormData) {
  try {
    const requester = await getCurrentUser();
    if (!requester || !["ADMIN", "RECEPTIONIST", "DOCTOR"].includes(requester.Role)) {
      throw new Error("Unauthorized: Only Admins, Doctors or Receptionists can add staff");
    }

    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const role = String(formData.get("role")) as Role;

    const existingUser = await prisma.user.findUnique({ where: { Email: email } });
    if (existingUser) return { success: false, error: "Email already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        Name: name,
        Email: email,
        Password: hashedPassword,
        Role: role,
        Status: "APPROVED",
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: number) {
  try {
    await prisma.user.delete({
      where: { UserID: userId },
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
