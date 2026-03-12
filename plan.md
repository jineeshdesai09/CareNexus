# OPD Management System - Progress & Roadmap

This document provides a detailed summary of the progress made to date and a structured plan for the upcoming phases of development.

## 🚀 Current Progress (Phase 1 & Initial Phase 2)

We have successfully overhauled the core clinical and financial workflows, ensuring the system is professional, secure, and user-friendly.

### 1. Clinical Excellence
- **Vitals Tracking**: Doctors can now capture detailed patient health data (BP, SpO2, Weight, etc.) directly during consultation.
- **Prescription Engine**: Replaced free-text notes with a structured system for medicine selection, dosage, and frequency.
- **Diagnosis Management**: Fast, checkbox-based diagnosis selection for common ailments.

### 2. Financial & Print Systems
- **Automated Billing**: Grand totals are calculated automatically based on registration charges and clinical services.
- **Professional PDFs**: High-quality, branded PDF generation for both prescriptions and payment receipts.
- **Payment Success Flow**: A dedicated success screen in the reception module for immediate receipt printing.

### 3. Patient Portal
- **Dashboard**: Patients can now log in to see their Patient ID and a summary of their latest visit.
- **Medical History**: A searchable list of all past consultations.
- **Self-Service**: Patients can download their own historical prescriptions and receipts as PDFs.

### 4. Security & Access Control
- **Unified Registration**: A new `/register` page allowing all roles (Staff & Patients) to sign up.
- **Admin Approval Queue**: All self-registered users are held in a `PENDING` state until an Admin approves them via the **Access Management** dashboard.
- **Profile Integration**: When users register, the system automatically creates their Doctor or Patient profiles to prevent system errors.

---

## 📅 Remaining Roadmap (Phase 2 & Beyond)

The next focus is expanding the system's operational reach into inventory and scheduling.

### Phase 2: Module Integration (In Progress)
- **Pharmacy Module**: 
    - Inventory management with stock tracking.
    - Prescription fulfillment queue for pharmacists.
    - Automatic stock deduction upon dispensing.
- **Appointment System**:
    - Manage doctor availability schedules.
    - Online/Offline scheduling for patients and receptionists.
- **Follow-up Manager**:
    - Automated flags for patients requiring a return visit.
    - Dashboard for doctors to track upcoming follow-ups.

### Phase 3: Scaling & Analytics
- **Admin Insights**: Revenue charts, patient volume analytics, and doctor performance metrics.
- **Advanced Inventory**: Expiry alerts for medicines and low-stock notifications.
- **Lab Integration**: (If required) Module for technicians to enter lab test results.

### Phase 4: Stabilization & Security
- **Middleware Protections**: Centralized role-based access control (RBAC) at the routing level.
- **System Hardening**: Performance optimization for large datasets and final UI/UX polish.

---

## 🛠 Status of Core Files
- `seed.sql`: Fully updated with secure hashed passwords and complete role data.
- `prisma/schema.prisma`: Foundation for all roles including `PATIENT`, `PHARMACIST`, and `LAB_TECHNICIAN`.
- `app/actions/`: Modular server actions for Auth, User Management, OPD, and Patient records.
