"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { getCurrentUser } from "../lib/auth";
import { Role } from "@prisma/client";
import { recordAuditLog } from "@/app/lib/audit";
import { sendApprovalEmail, sendPasswordResetEmail } from "@/app/lib/mail";

export async function updateUserStatus(userId: number, status: "APPROVED" | "REJECTED") {
  try {
    const requester = await getCurrentUser();
    const user = await prisma.user.update({
      where: { UserID: userId },
      data: { Status: status },
    });

    if (status === "APPROVED") {
      await sendApprovalEmail(user.Email, user.Name, user.Role);
    }

    if (requester) {
      await recordAuditLog({
        Action: status === "APPROVED" ? "UPDATE" : "DELETE",
        Module: "USER_MANAGEMENT",
        UserID: requester.UserID,
        Details: `${status} user: ${user.Name} (${user.Email})`,
      });
    }

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
    const newUser = await prisma.user.create({
      data: {
        Name: name,
        Email: email,
        Password: hashedPassword,
        Role: role,
        Status: "APPROVED",
      },
    });

    // Send email with credentials
    await sendApprovalEmail(email, name, role, password);

    await recordAuditLog({
      Action: "CREATE",
      Module: "USER_MANAGEMENT",
      UserID: requester.UserID,
      Details: `Created staff user: ${name} as ${role}`,
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
    const requester = await getCurrentUser();
    const user = await prisma.user.delete({
      where: { UserID: userId },
    });

    if (requester) {
      await recordAuditLog({
        Action: "DELETE",
        Module: "USER_MANAGEMENT",
        UserID: requester.UserID,
        Details: `Deleted user: ${user.Name} (${user.Email})`,
      });
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function updateUser(userId: number, formData: FormData) {
  try {
    const requester = await getCurrentUser();
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const role = String(formData.get("role")) as Role;
    const status = String(formData.get("status"));

    // Fetch existing user to check if status changed to APPROVED
    const existingUser = await prisma.user.findUnique({ where: { UserID: userId } });

    const user = await prisma.user.update({
      where: { UserID: userId },
      data: {
        Name: name,
        Email: email,
        Role: role,
        Status: status,
      },
    });

    // If status was changed to APPROVED, send email
    if (existingUser?.Status !== "APPROVED" && status === "APPROVED") {
      await sendApprovalEmail(user.Email, user.Name, user.Role);
    }

    if (requester) {
      await recordAuditLog({
        Action: "UPDATE",
        Module: "USER_MANAGEMENT",
        UserID: requester.UserID,
        Details: `Updated user details for: ${user.Name} (${user.Email})`,
      });
    }

    revalidatePath("/admin/users");
  } catch (error: any) {
    redirect(`/admin/users/${userId}/edit?error=profile`);
  }
  redirect(`/admin/users/${userId}/edit?success=profile`);
}

export async function resetPassword(userId: number, formData: FormData) {
  try {
    const requester = await getCurrentUser();
    const password = String(formData.get("password"));
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { UserID: userId },
      data: { Password: hashedPassword },
    });

    // Send password reset email
    await sendPasswordResetEmail(user.Email, user.Name, password);

    if (requester) {
      await recordAuditLog({
        Action: "UPDATE",
        Module: "USER_MANAGEMENT",
        UserID: requester.UserID,
        Details: `Reset password for user: ${user.Name} (${user.Email})`,
      });
    }
  } catch (error: any) {
    redirect(`/admin/users/${userId}/edit?error=password`);
  }
  redirect(`/admin/users/${userId}/edit?success=password`);
}
