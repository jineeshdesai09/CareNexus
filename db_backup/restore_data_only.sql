COPY public."DiagnosisType" ("DiagnosisTypeID", "DiagnosisTypeName", "DiagnosisTypeShortName", "IsActive", "HospitalID", "Description", "UserID", "Created", "Modified") FROM stdin;
\.
COPY public."Doctor" ("DoctorID", "HospitalID", "Created", "Modified", "AboutDoctor", "Address", "ConsultationFee", "DOB", "Department", "Email", "ExperienceYears", "FirstName", "Gender", "IsEmergencyAvailable", "LastName", "MobileNo", "Qualification", "RegistrationCouncil", "RegistrationNo", "Specialization", "UserID") FROM stdin;
\.
COPY public."DoctorAvailability" ("AvailabilityID", "DoctorID", "DayOfWeek", "FromTime", "ToTime", "MaxPatients", "IsAvailable", "IsEmergencyOnly", "Created", "Modified") FROM stdin;
\.
COPY public."Hospital" ("HospitalID", "HospitalName", "Address", "OpeningDate", "Created", "Modified", "DefaultPaymentModeID", "Description", "IsRateEnableInReceipt", "IsRegistrationFeeEnableInOPD", "OpeningOPDNo", "OpeningPatientNo", "OpeningReceiptNo", "RegistrationCharge", "RegistrationValidityMonths", "UserID") FROM stdin;
\.
COPY public."LabOrder" ("OrderID", "OPDID", "PatientID", "DoctorID", "OrderDate", "Status", "TotalAmount", "Notes", "Created", "Modified") FROM stdin;
\.
COPY public."LabOrderItem" ("OrderItemID", "OrderID", "TestID", "Price", "ResultValue", "ResultNotes", "Status", "Created", "Modified") FROM stdin;
\.
COPY public."LabTest" ("TestID", "TestName", "TestCode", "CategoryID", "Price", "IsActive", "Created", "Modified") FROM stdin;
\.
COPY public."LabTestCategory" ("CategoryID", "CategoryName", "Description", "Created", "Modified") FROM stdin;
\.
COPY public."Medicine" ("MedicineID", "Name", "GenericName", "Category", "Manufacturer", "Created", "Modified") FROM stdin;
\.
COPY public."OPD" ("OPDID", "OPDNo", "OPDDateTime", "PatientID", "TreatedByDoctorID", "IsFollowUpCase", "RegistrationFee", "Description", "UserID", "OLDOPDNo", "Created", "Modified", "ConsultationEnd", "ConsultationStart", "FollowUpDate", "IsEmergency", "Status", "TokenNo", "BP_Diastolic", "BP_Systolic", "Height", "Pulse", "SpO2", "Temperature", "Weight") FROM stdin;
\.
COPY public."OPDDiagnosisType" ("OPDDiagnosisTypeID", "OPDID", "DiagnosisTypeID", "Description", "UserID", "Created", "Modified") FROM stdin;
\.
COPY public."Patient" ("PatientID", "PatientName", "PatientNo", "RegistrationDateTime", "BloodGroup", "Gender", "Occupation", "Address", "StateID", "CityID", "PinCode", "MobileNo", "EmergencyContactNo", "ReferredBy", "Description", "HospitalID", "UserID", "Created", "Modified", "DOB", "Age", "Height") FROM stdin;
\.
COPY public."Prescription" ("PrescriptionID", "OPDID", "Notes", "Created", "Modified") FROM stdin;
\.
COPY public."PrescriptionMedicine" ("ID", "PrescriptionID", "MedicineID", "MedicineName", "Dosage", "Frequency", "Duration", "Instructions", "Created", "Modified") FROM stdin;
\.
COPY public."Receipt" ("ReceiptID", "ReceiptNo", "ReceiptDate", "OPDID", "AmountPaid", "PaymentModeID", "ReferenceNo", "ReferenceDate", "CancellationDateTime", "CancellationByUserID", "CancellationRemarks", "Description", "UserID", "Created", "Modified") FROM stdin;
\.
COPY public."ReceiptTran" ("ReceiptTranID", "ReceiptID", "SubTreatmentTypeID", "Rate", "Quantity", "Amount", "Description", "UserID", "Created", "Modified") FROM stdin;
\.
COPY public."SubTreatmentType" ("SubTreatmentTypeID", "SubTreatmentTypeName", "TreatmentTypeID", "Rate", "IsActive", "Description", "UserID", "AccountID", "Created", "Modified") FROM stdin;
\.
COPY public."TreatmentType" ("TreatmentTypeID", "TreatmentTypeName", "TreatmentTypeShortName", "HospitalID", "Description", "UserID", "Created", "Modified") FROM stdin;
\.
COPY public."User" ("UserID", "Name", "Email", "Password", "Role", "Created", "Modified", "Status") FROM stdin;
\.
