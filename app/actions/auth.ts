"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { createSession } from "../lib/session";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export async function login(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

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

  if (user.Role !== "ADMIN" && user.Status !== "APPROVED") {
    redirect(`/login?error=pending&status=${user.Status}`);
  }

  await createSession(user.UserID);

  // Automatic redirection based on role
  switch (user.Role) {
    case "ADMIN":
      redirect("/admin/dashboard");
    case "DOCTOR":
      redirect("/doctor/dashboard");
    case "RECEPTIONIST":
      redirect("/reception/dashboard");
    case "PATIENT":
      redirect("/patient/dashboard");
    case "PHARMACIST":
      redirect("/pharmacy/dashboard");
    case "LAB_TECHNICIAN":
      redirect("/lab/dashboard");
    default:
      redirect("/login");
  }
}

export async function register(formData: FormData) {
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const role = String(formData.get("role")) as Role;
  
  if (["PHARMACIST", "LAB_TECHNICIAN", "ADMIN"].includes(role)) {
    redirect("/register?error=restricted");
  }

  const existingUser = await prisma.user.findUnique({
    where: { Email: email },
  });

  if (existingUser) {
    redirect("/register?error=exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: role,
      Status: "PENDING",
    },
  });

  // Role-specific profile creation (stubs/initial records)
  const hospital = await prisma.hospital.findFirst();
  if (hospital) {
    const commonData = {
      MobileNo: formData.get("mobile") ? String(formData.get("mobile")) : "0000000000",
      Gender: formData.get("gender") ? String(formData.get("gender")) : "Other",
      HospitalID: hospital.HospitalID,
      UserID: user.UserID,
    };

    const dob = formData.get("dob") ? new Date(String(formData.get("dob"))) : new Date("1990-01-01");

    if (role === "PATIENT") {
        const lastPatient = await prisma.patient.findFirst({
            orderBy: { PatientNo: "desc" },
        });
        const nextNo = lastPatient ? lastPatient.PatientNo + 1 : (hospital.OpeningPatientNo || 1000);

        await prisma.patient.create({
            data: {
                PatientName: name,
                PatientNo: nextNo,
                RegistrationDateTime: new Date(),
                DOB: dob,
                Age: new Date().getFullYear() - dob.getFullYear(),
                ...commonData
            }
        });
    } else if (role === "DOCTOR") {
        const parts = name.split(" ");
        await prisma.doctor.create({
            data: {
                FirstName: parts[0],
                LastName: parts.slice(1).join(" ") || "Staff",
                Email: email,
                RegistrationNo: "PENDING",
                Specialization: "General Physician",
                Department: "General Medicine",
                ConsultationFee: 0,
                ...commonData
            }
        });
    } else if (role === "RECEPTIONIST") {
        // These roles don't have separate profile tables in the schema yet, 
        // but we can log their creation or track them via the User table.
        // If specific tables are added later, we'd add them here.
        console.log(`Profile created in User table for ${role}: ${email}`);
    }
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
  }

  redirect("/login?message=registered");
}
