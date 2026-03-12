-- Seed SQL for OPD Management System
-- This script populates basic data for testing and initial setup

-- 1. Insert Hospital Details
INSERT INTO "Hospital" ("HospitalName", "Address", "RegistrationCharge", "OpeningDate", "Modified")
VALUES ('City General Hospital', '123 Health Ave, Medical District', 150.00, NOW(), NOW())
ON CONFLICT ("HospitalID") DO NOTHING;

-- 2. Insert Users
INSERT INTO "User" ("Name", "Email", "Password", "Status", "Role", "Modified")
VALUES 
('System Admin', 'admin@hospital.com', '$2b$10$7R9R9jB8l8o9v8z.w8y8u.U9y9u9y9u9y9u9y9u9y9u9y9u9y9u9y', 'APPROVED', 'ADMIN', NOW()),
('Dr. Sarah Smith', 'doctor@hospital.com', '$2b$10$7R9R9jB8l8o9v8z.w8y8u.U9y9u9y9u9y9u9y9u9y9u9y9u9y9u9y', 'APPROVED', 'DOCTOR', NOW()),
('John Reception', 'reception@hospital.com', '$2b$10$7R9R9jB8l8o9v8z.w8y8u.U9y9u9y9u9y9u9y9u9y9u9y9u9y9u9y', 'APPROVED', 'RECEPTIONIST', NOW()),
('Mike Patient', 'patient@hospital.com', '$2b$10$7R9R9jB8l8o9v8z.w8y8u.U9y9u9y9u9y9u9y9u9y9u9y9u9y9u9y', 'APPROVED', 'PATIENT', NOW())
ON CONFLICT ("Email") DO NOTHING;
-- Note: Password for all is 'password123' hashed with bcrypt (cost 10)

-- 3. Insert Doctor Profile
INSERT INTO "Doctor" ("FirstName", "LastName", "Email", "Gender", "MobileNo", "RegistrationNo", "Specialization", "Department", "ConsultationFee", "HospitalID", "UserID", "Modified")
SELECT 'Sarah', 'Smith', 'doctor@hospital.com', 'Female', '9988776655', 'REG12345', 'General Physician', 'General Medicine', 500.00, h."HospitalID", u."UserID", NOW()
FROM "Hospital" h
CROSS JOIN (SELECT "UserID" FROM "User" WHERE "Email" = 'doctor@hospital.com' LIMIT 1) u
LIMIT 1
ON CONFLICT DO NOTHING;

-- 4. Insert Diagnosis Types
INSERT INTO "DiagnosisType" ("DiagnosisTypeName", "DiagnosisTypeShortName", "HospitalID", "Modified")
SELECT vals.name, vals.short, h."HospitalID", NOW()
FROM (
  VALUES 
    ('Common Cold', 'COLD'),
    ('Viral Fever', 'FEVER'),
    ('Hypertension', 'BP')
) AS vals(name, short)
CROSS JOIN (SELECT "HospitalID" FROM "Hospital" LIMIT 1) as h
ON CONFLICT DO NOTHING;

-- 5. Insert Treatment Types & Sub-Treatments
WITH new_treatment AS (
    INSERT INTO "TreatmentType" ("TreatmentTypeName", "HospitalID", "Modified")
    SELECT 'General Services', "HospitalID", NOW() FROM "Hospital" LIMIT 1
    RETURNING "TreatmentTypeID"
)
INSERT INTO "SubTreatmentType" ("SubTreatmentTypeName", "TreatmentTypeID", "Rate", "Modified")
SELECT vals.name, nt."TreatmentTypeID", vals.rate, NOW()
FROM (
  VALUES 
    ('Regular Consultation', 200.00),
    ('Emergency Consultation', 500.00),
    ('Blood Pressure Monitoring', 50.00)
) AS vals(name, rate)
CROSS JOIN new_treatment nt
ON CONFLICT DO NOTHING;

-- 6. Insert Sample Patient Profile
INSERT INTO "Patient" ("PatientName", "PatientNo", "RegistrationDateTime", "DOB", "Age", "Gender", "MobileNo", "HospitalID", "UserID", "Modified")
SELECT 'Mike Patient', 1001, NOW(), '1990-01-01', 34, 'Male', '9876543210', h."HospitalID", u."UserID", NOW()
FROM "Hospital" h
CROSS JOIN (SELECT "UserID" FROM "User" WHERE "Email" = 'patient@hospital.com' LIMIT 1) u
LIMIT 1
ON CONFLICT DO NOTHING;
