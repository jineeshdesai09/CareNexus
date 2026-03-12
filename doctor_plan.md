# Doctor Role Implementation Plan

## Goal Description
The objective is to analyze the existing features available to the `DOCTOR` role in the OPD Management System and outline a comprehensive plan for enhancing their workflow. This ensures doctors have all necessary tools for patient consultations, history tracking, and scheduling.

## Current State Analysis

### 1. What is currently implemented:
- **Doctor Dashboard (`/doctor/dashboard`)**: Displays a real-time queue of today's appointments with token numbers, patient details, and status. Allows doctors to jump into consultations.
- **Consultation Room (`/doctor/opd/[id]`)**: A comprehensive form for:
  - Entering patient vitals (Weight, Height, Temp, Pulse, BP, SpO2, etc.).
  - Selecting diagnoses via checkboxes.
  - Writing prescriptions (Medicines, dosage, frequency, duration).
  - Adding clinical notes.
  - Generating & printing professional PDF prescriptions/receipts upon completion.
- **Staff Management (`/doctor/staff/add`)**: Allows doctors to register Pharmacists and Lab Technicians to support their workflow.
- **Today's OPD list (`/doctor/opd/today`)**: An alternative table view for managing today's queue (Start/End consultation actions).

### 2. Missing Features & Workflows (Gaps):
- **Patient Medical History**: During a consultation, doctors cannot currently view a patient's past visits, previous diagnoses, or old prescriptions.
- **Follow-up Manager**: No dedicated view for doctors to track patients who are scheduled for upcoming follow-up visits.
- **My Schedule / Availability**: Admins can manage a doctor's schedule (`/admin/doctors/[id]/availability`), but doctors have no interface to view or manage their own weekly availability.
- **Lab Order Integration**: Doctors can add lab technicians, but there is no UI in the consultation room to actually *order* lab tests for a patient.
- **Dashboard Analytics**: The dashboard is limited to today's queue. It lacks basic insights (e.g., total patients seen, upcoming follow-ups).

---

## Proposed Changes

### Phase 1: Core Patient Insight & Navigation
These are features immediately necessary to support a doctor's core consultation workflow, making them more efficient and informed during patient visits.

#### Feature 1: Patient Medical History Viewer
**Goal:** Allow doctors to see previous consultations for the same patient while in the consultation room.
- **File(s) Modified:** `app/doctor/opd/[id]/page.tsx`
- **Implementation Details:** 
  - Add a new section or a sliding drawer/modal to fetch and display all `OPD` records where `PatientID` matches the current patient and `Status === "COMPLETED" | "CLOSED"`.
  - Display past vitals, diagnoses, and prescriptions.

#### Feature 2: Follow-up & All Patients Manager
**Goal:** Give doctors a dedicated page to see all their past patients and upcoming follow-ups.
- **File(s) Created:** `app/doctor/patients/page.tsx`
- **Implementation Details:**
  - A data table listing all unique patients treated by the doctor.
  - A tab or filter for "Upcoming Follow-ups" (based on `FollowUpDate` in the OPD model).
  - Quick links to start a new consultation or view history from this page.

---

### Phase 2: Scheduling & Dashboard Analytics
These features enhance the doctor's ability to manage their time and understand their workload.

#### Feature 3: Doctor Availability View
**Goal:** Allow doctors to view their weekly schedule.
- **File(s) Created:** `app/doctor/schedule/page.tsx`
- **Implementation Details:**
  - Fetch the doctor's `DoctorAvailability` records.
  - Display a weekly calendar or list view of their working hours and `MaxPatients` per day.
  - *(Optional)* Add functionality for doctors to request schedule changes from Admin.

#### Feature 4: Dashboard Enhancements
**Goal:** Provide more meaningful metrics beyond just today's queue.
- **File(s) Modified:** `app/doctor/dashboard/page.tsx`
- **Implementation Details:**
  - Add summary cards for metrics: "Total Patients Seen (This Month)", "Upcoming Follow-ups (This Week)".

---

### Phase 3: Advanced Clinical Features (Future Phase)
These features require broader system integration, such as coordinating with labs or pharmacy modules.

#### Feature 5: Lab Test Ordering
**Goal:** Integrate lab requests into the consultation flow.
- **File(s) Modified:** `prisma/schema.prisma`
  - Add `LabTestType` and `OPDLabTest` models if not existing.
- **File(s) Modified:** `app/doctor/opd/[id]/page.tsx`
  - Add a multi-select for ordering lab tests during the consultation. This order should route to the Lab Technician portal.

---

## Verification Plan

### Automated/Code Verification
- Ensure `npx prisma generate` runs successfully if schema changes are made.
- Verify typescript types match the expected payloads in all server actions.

### Manual Verification Steps
1. **Medical History:** Log in as a Doctor, open an ongoing consultation for a patient who has past visits, and verify that previous prescriptions and vitals are visible and accurate.
2. **Follow-ups:** Log in as a Doctor, navigate to the new "Patients" tab, and verify that patients with a scheduled `FollowUpDate` appear correctly in the upcoming list.
3. **Schedule View:** Log in as a Doctor, navigate to "My Schedule", and ensure it perfectly matches the availability set by the Admin in the backend.

## User Review Required
> [!IMPORTANT]
> Please review the proposed plan. Let me know which of these features (Medical History, Follow-ups, Schedule View) you'd like to prioritize implementing first, or if there are other specific features you'd like to add for the Doctor role!
