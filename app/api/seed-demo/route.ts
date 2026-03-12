import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export async function GET() {
    try {
        // 1. HOSPITAL
        let hospital = await prisma.hospital.findFirst();
        if (!hospital) {
            hospital = await prisma.hospital.create({
                data: {
                    HospitalName: "City Care Hospital",
                    Address: "123 Health Ave, Metropolis",
                    OpeningDate: new Date(),
                    RegistrationCharge: 200,
                    RegistrationValidityMonths: 6,
                    OpeningPatientNo: 1000,
                    OpeningOPDNo: 5000,
                    OpeningReceiptNo: 10000,
                    IsRateEnableInReceipt: true,
                    IsRegistrationFeeEnableInOPD: true,
                },
            });
        }

        // 2. ADMIN USER
        const adminEmail = "admin@hospital.com";
        if (!(await prisma.user.findUnique({ where: { Email: adminEmail } }))) {
            await prisma.user.create({
                data: {
                    Name: "Super Admin",
                    Email: adminEmail,
                    Password: await bcrypt.hash("admin123", 10),
                    Role: "ADMIN",
                },
            });
        }

        // 3. RECEPTION USER
        const recEmail = "reception@hospital.com";
        if (!(await prisma.user.findUnique({ where: { Email: recEmail } }))) {
            await prisma.user.create({
                data: {
                    Name: "Front Desk",
                    Email: recEmail,
                    Password: await bcrypt.hash("reception123", 10),
                    Role: "RECEPTIONIST",
                },
            });
        }

        // 4. DOCTORS & USERS
        const doctors = [
            { fName: "Sarah", lName: "Jenkins", spec: "Cardiology", dept: "Cardio", fee: 800 },
            { fName: "Michael", lName: "Chang", spec: "Neurology", dept: "Neuro", fee: 1000 },
            { fName: "Emily", lName: "Ross", spec: "General Medicine", dept: "General", fee: 500 },
        ];

        const doctorRecords = [];
        for (const d of doctors) {
            const email = `${d.fName.toLowerCase()}.${d.lName.toLowerCase()}@hospital.com`;
            let user = await prisma.user.findUnique({ where: { Email: email } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        Name: `Dr. ${d.fName} ${d.lName}`,
                        Email: email,
                        Password: await bcrypt.hash("doctor123", 10),
                        Role: "DOCTOR",
                    },
                });
            }

            let doctor = await prisma.doctor.findFirst({ where: { Email: email } });
            if (!doctor) {
                doctor = await prisma.doctor.create({
                    data: {
                        FirstName: d.fName,
                        LastName: d.lName,
                        Gender: "Unknown",
                        MobileNo: "9000000000",
                        Email: email,
                        RegistrationNo: `REG-${Math.floor(Math.random() * 90000) + 10000}`,
                        Specialization: d.spec,
                        Department: d.dept,
                        ConsultationFee: d.fee,
                        HospitalID: hospital.HospitalID,
                        UserID: user.UserID,
                    },
                });
            }
            doctorRecords.push(doctor);
        }

        // 5. PATIENTS
        const patientsData = [
            { name: "John Doe", age: 35, mobile: "9876543210", gender: "Male" },
            { name: "Alice Smith", age: 28, mobile: "9876543211", gender: "Female" },
            { name: "Robert Johnson", age: 45, mobile: "9876543212", gender: "Male" },
            { name: "Emma Davis", age: 62, mobile: "9876543213", gender: "Female" },
            { name: "Liam Wilson", age: 12, mobile: "9876543214", gender: "Male" },
        ];

        const patientRecords = [];
        let currentPatientNo = hospital.OpeningPatientNo || 1000;

        // Clear out patients to avoid unique constraint collisions on PatientNo if rerunning often,
        // or just increment
        const existingPatientCount = await prisma.patient.count();
        currentPatientNo += existingPatientCount;

        for (const p of patientsData) {
            const dob = new Date();
            dob.setFullYear(dob.getFullYear() - p.age);

            const newPatient = await prisma.patient.create({
                data: {
                    PatientName: p.name,
                    PatientNo: currentPatientNo++,
                    RegistrationDateTime: new Date(),
                    DOB: dob,
                    Age: p.age,
                    Gender: p.gender,
                    MobileNo: p.mobile,
                    HospitalID: hospital.HospitalID,
                },
            });
            patientRecords.push(newPatient);
        }

        // 6. DIAGNOSIS TYPES
        const diagnoses = ["Hypertension", "Type 2 Diabetes", "Migraine", "Acute Bronchitis", "Osteoarthritis"];
        for (const d of diagnoses) {
            const exists = await prisma.diagnosisType.findFirst({ where: { DiagnosisTypeName: d } });
            if (!exists) {
                await prisma.diagnosisType.create({
                    data: { DiagnosisTypeName: d, DiagnosisTypeShortName: d.substring(0, 3).toUpperCase(), HospitalID: hospital.HospitalID },
                });
            }
        }

        // 7. TREATMENT TYPES
        const treatments = [
            {
                name: "Blood Tests",
                subs: [
                    { name: "CBC", rate: 300 },
                    { name: "Lipid Profile", rate: 500 },
                    { name: "HbA1c", rate: 400 },
                ],
            },
            {
                name: "Imaging",
                subs: [
                    { name: "X-Ray Chest PA", rate: 400 },
                    { name: "MRI Brain", rate: 6000 },
                    { name: "Ultrasound Abdomen", rate: 1000 },
                ],
            },
            {
                name: "Procedures",
                subs: [
                    { name: "ECG", rate: 250 },
                    { name: "Nebulization", rate: 150 },
                ],
            },
        ];

        for (const t of treatments) {
            let treatmentType = await prisma.treatmentType.findFirst({ where: { TreatmentTypeName: t.name } });
            if (!treatmentType) {
                treatmentType = await prisma.treatmentType.create({
                    data: { TreatmentTypeName: t.name, HospitalID: hospital.HospitalID },
                });
            }

            for (const s of t.subs) {
                const subExists = await prisma.subTreatmentType.findFirst({ where: { SubTreatmentTypeName: s.name } });
                if (!subExists) {
                    await prisma.subTreatmentType.create({
                        data: { SubTreatmentTypeName: s.name, TreatmentTypeID: treatmentType.TreatmentTypeID, Rate: s.rate },
                    });
                }
            }
        }

        // 8. OPDS
        // Create some waiting queue entries
        for (let i = 0; i < 4; i++) {
            await prisma.oPD.create({
                data: {
                    OPDDateTime: new Date(),
                    TokenNo: i + 1,
                    Status: "WAITING",
                    IsEmergency: i === 3,
                    PatientID: patientRecords[i].PatientID,
                    TreatedByDoctorID: doctorRecords[i % doctorRecords.length].DoctorID,
                    RegistrationFee: hospital.RegistrationCharge || 200,
                },
            });
        }

        // Create one completed entry
        await prisma.oPD.create({
            data: {
                OPDDateTime: new Date(),
                TokenNo: 5,
                Status: "COMPLETED",
                IsEmergency: false,
                PatientID: patientRecords[4].PatientID,
                TreatedByDoctorID: doctorRecords[0].DoctorID,
                RegistrationFee: hospital.RegistrationCharge || 200,
            },
        });

        return NextResponse.json({ message: "Demo Data Successfully Seeded!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
    }
}
