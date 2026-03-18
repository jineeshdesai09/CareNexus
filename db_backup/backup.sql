--
-- PostgreSQL database dump
--

\restrict fDu2c850Jf9CuWMzmH3hfeleXzc33JjnFdZZ2PiAmPhGeb9wvmtnBYYmOhGfNyk

-- Dumped from database version 16.11 (Homebrew)
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: jdsmac
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO jdsmac;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: jdsmac
--

COMMENT ON SCHEMA public IS '';


--
-- Name: LabOrderStatus; Type: TYPE; Schema: public; Owner: jdsmac
--

CREATE TYPE public."LabOrderStatus" AS ENUM (
    'PENDING',
    'SAMPLE_COLLECTED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."LabOrderStatus" OWNER TO jdsmac;

--
-- Name: OPDStatus; Type: TYPE; Schema: public; Owner: jdsmac
--

CREATE TYPE public."OPDStatus" AS ENUM (
    'REGISTERED',
    'WAITING',
    'IN_CONSULTATION',
    'COMPLETED',
    'BILLED',
    'CLOSED',
    'CANCELLED'
);


ALTER TYPE public."OPDStatus" OWNER TO jdsmac;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: jdsmac
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'DOCTOR',
    'RECEPTIONIST',
    'PATIENT'
);


ALTER TYPE public."Role" OWNER TO jdsmac;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: DiagnosisType; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."DiagnosisType" (
    "DiagnosisTypeID" integer NOT NULL,
    "DiagnosisTypeName" character varying(250) NOT NULL,
    "DiagnosisTypeShortName" character varying(50),
    "IsActive" boolean DEFAULT true NOT NULL,
    "HospitalID" integer NOT NULL,
    "Description" character varying(250),
    "UserID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DiagnosisType" OWNER TO jdsmac;

--
-- Name: DiagnosisType_DiagnosisTypeID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."DiagnosisType_DiagnosisTypeID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DiagnosisType_DiagnosisTypeID_seq" OWNER TO jdsmac;

--
-- Name: DiagnosisType_DiagnosisTypeID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."DiagnosisType_DiagnosisTypeID_seq" OWNED BY public."DiagnosisType"."DiagnosisTypeID";


--
-- Name: Doctor; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."Doctor" (
    "DoctorID" integer NOT NULL,
    "HospitalID" integer NOT NULL,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL,
    "AboutDoctor" text,
    "Address" text,
    "ConsultationFee" numeric(10,2) NOT NULL,
    "DOB" timestamp(3) without time zone,
    "Department" text NOT NULL,
    "Email" character varying(150) NOT NULL,
    "ExperienceYears" integer,
    "FirstName" character varying(100) NOT NULL,
    "Gender" character varying(10) NOT NULL,
    "IsEmergencyAvailable" boolean DEFAULT false NOT NULL,
    "LastName" character varying(100) NOT NULL,
    "MobileNo" character varying(20) NOT NULL,
    "Qualification" text,
    "RegistrationCouncil" text,
    "RegistrationNo" character varying(100) NOT NULL,
    "Specialization" text NOT NULL,
    "UserID" integer
);


ALTER TABLE public."Doctor" OWNER TO jdsmac;

--
-- Name: DoctorAvailability; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."DoctorAvailability" (
    "AvailabilityID" integer NOT NULL,
    "DoctorID" integer NOT NULL,
    "DayOfWeek" integer NOT NULL,
    "FromTime" character varying(10) NOT NULL,
    "ToTime" character varying(10) NOT NULL,
    "MaxPatients" integer NOT NULL,
    "IsAvailable" boolean DEFAULT true NOT NULL,
    "IsEmergencyOnly" boolean DEFAULT false NOT NULL,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DoctorAvailability" OWNER TO jdsmac;

--
-- Name: DoctorAvailability_AvailabilityID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."DoctorAvailability_AvailabilityID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DoctorAvailability_AvailabilityID_seq" OWNER TO jdsmac;

--
-- Name: DoctorAvailability_AvailabilityID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."DoctorAvailability_AvailabilityID_seq" OWNED BY public."DoctorAvailability"."AvailabilityID";


--
-- Name: Doctor_DoctorID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."Doctor_DoctorID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Doctor_DoctorID_seq" OWNER TO jdsmac;

--
-- Name: Doctor_DoctorID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."Doctor_DoctorID_seq" OWNED BY public."Doctor"."DoctorID";


--
-- Name: Hospital; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."Hospital" (
    "HospitalID" integer NOT NULL,
    "HospitalName" character varying(250) NOT NULL,
    "Address" character varying(500),
    "OpeningDate" timestamp(3) without time zone NOT NULL,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL,
    "DefaultPaymentModeID" integer,
    "Description" character varying(250),
    "IsRateEnableInReceipt" boolean DEFAULT false,
    "IsRegistrationFeeEnableInOPD" boolean DEFAULT false,
    "OpeningOPDNo" integer,
    "OpeningPatientNo" integer,
    "OpeningReceiptNo" integer,
    "RegistrationCharge" numeric(10,2),
    "RegistrationValidityMonths" integer,
    "UserID" integer
);


ALTER TABLE public."Hospital" OWNER TO jdsmac;

--
-- Name: Hospital_HospitalID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."Hospital_HospitalID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Hospital_HospitalID_seq" OWNER TO jdsmac;

--
-- Name: Hospital_HospitalID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."Hospital_HospitalID_seq" OWNED BY public."Hospital"."HospitalID";


--
-- Name: LabOrder; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."LabOrder" (
    "OrderID" integer NOT NULL,
    "OPDID" integer NOT NULL,
    "PatientID" integer NOT NULL,
    "DoctorID" integer NOT NULL,
    "OrderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Status" public."LabOrderStatus" DEFAULT 'PENDING'::public."LabOrderStatus" NOT NULL,
    "TotalAmount" numeric(10,2) NOT NULL,
    "Notes" text,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LabOrder" OWNER TO jdsmac;

--
-- Name: LabOrderItem; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."LabOrderItem" (
    "OrderItemID" integer NOT NULL,
    "OrderID" integer NOT NULL,
    "TestID" integer NOT NULL,
    "Price" numeric(10,2) NOT NULL,
    "ResultValue" text,
    "ResultNotes" text,
    "Status" public."LabOrderStatus" DEFAULT 'PENDING'::public."LabOrderStatus" NOT NULL,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LabOrderItem" OWNER TO jdsmac;

--
-- Name: LabOrderItem_OrderItemID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."LabOrderItem_OrderItemID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LabOrderItem_OrderItemID_seq" OWNER TO jdsmac;

--
-- Name: LabOrderItem_OrderItemID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."LabOrderItem_OrderItemID_seq" OWNED BY public."LabOrderItem"."OrderItemID";


--
-- Name: LabOrder_OrderID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."LabOrder_OrderID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LabOrder_OrderID_seq" OWNER TO jdsmac;

--
-- Name: LabOrder_OrderID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."LabOrder_OrderID_seq" OWNED BY public."LabOrder"."OrderID";


--
-- Name: LabTest; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."LabTest" (
    "TestID" integer NOT NULL,
    "TestName" character varying(250) NOT NULL,
    "TestCode" character varying(50),
    "CategoryID" integer NOT NULL,
    "Price" numeric(10,2) NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LabTest" OWNER TO jdsmac;

--
-- Name: LabTestCategory; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."LabTestCategory" (
    "CategoryID" integer NOT NULL,
    "CategoryName" character varying(250) NOT NULL,
    "Description" character varying(500),
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LabTestCategory" OWNER TO jdsmac;

--
-- Name: LabTestCategory_CategoryID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."LabTestCategory_CategoryID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LabTestCategory_CategoryID_seq" OWNER TO jdsmac;

--
-- Name: LabTestCategory_CategoryID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."LabTestCategory_CategoryID_seq" OWNED BY public."LabTestCategory"."CategoryID";


--
-- Name: LabTest_TestID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."LabTest_TestID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LabTest_TestID_seq" OWNER TO jdsmac;

--
-- Name: LabTest_TestID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."LabTest_TestID_seq" OWNED BY public."LabTest"."TestID";


--
-- Name: Medicine; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."Medicine" (
    "MedicineID" integer NOT NULL,
    "Name" character varying(250) NOT NULL,
    "GenericName" character varying(250),
    "Category" character varying(100),
    "Manufacturer" character varying(250),
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Medicine" OWNER TO jdsmac;

--
-- Name: Medicine_MedicineID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."Medicine_MedicineID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Medicine_MedicineID_seq" OWNER TO jdsmac;

--
-- Name: Medicine_MedicineID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."Medicine_MedicineID_seq" OWNED BY public."Medicine"."MedicineID";


--
-- Name: OPD; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."OPD" (
    "OPDID" integer NOT NULL,
    "OPDNo" character varying(250),
    "OPDDateTime" timestamp(3) without time zone NOT NULL,
    "PatientID" integer NOT NULL,
    "TreatedByDoctorID" integer NOT NULL,
    "IsFollowUpCase" boolean DEFAULT false NOT NULL,
    "RegistrationFee" numeric(10,2) NOT NULL,
    "Description" character varying(250),
    "UserID" integer,
    "OLDOPDNo" character varying(250),
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL,
    "ConsultationEnd" timestamp(3) without time zone,
    "ConsultationStart" timestamp(3) without time zone,
    "FollowUpDate" timestamp(3) without time zone,
    "IsEmergency" boolean DEFAULT false NOT NULL,
    "Status" public."OPDStatus" DEFAULT 'REGISTERED'::public."OPDStatus" NOT NULL,
    "TokenNo" integer,
    "BP_Diastolic" integer,
    "BP_Systolic" integer,
    "Height" numeric(5,2),
    "Pulse" integer,
    "SpO2" integer,
    "Temperature" numeric(4,1),
    "Weight" numeric(5,2)
);


ALTER TABLE public."OPD" OWNER TO jdsmac;

--
-- Name: OPDDiagnosisType; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."OPDDiagnosisType" (
    "OPDDiagnosisTypeID" integer NOT NULL,
    "OPDID" integer NOT NULL,
    "DiagnosisTypeID" integer NOT NULL,
    "Description" character varying(250),
    "UserID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OPDDiagnosisType" OWNER TO jdsmac;

--
-- Name: OPDDiagnosisType_OPDDiagnosisTypeID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."OPDDiagnosisType_OPDDiagnosisTypeID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OPDDiagnosisType_OPDDiagnosisTypeID_seq" OWNER TO jdsmac;

--
-- Name: OPDDiagnosisType_OPDDiagnosisTypeID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."OPDDiagnosisType_OPDDiagnosisTypeID_seq" OWNED BY public."OPDDiagnosisType"."OPDDiagnosisTypeID";


--
-- Name: OPD_OPDID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."OPD_OPDID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OPD_OPDID_seq" OWNER TO jdsmac;

--
-- Name: OPD_OPDID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."OPD_OPDID_seq" OWNED BY public."OPD"."OPDID";


--
-- Name: Patient; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."Patient" (
    "PatientID" integer NOT NULL,
    "PatientName" character varying(250) NOT NULL,
    "PatientNo" integer NOT NULL,
    "RegistrationDateTime" timestamp(3) without time zone NOT NULL,
    "BloodGroup" character varying(20),
    "Gender" character varying(10) NOT NULL,
    "Occupation" character varying(100),
    "Address" character varying(250),
    "StateID" integer,
    "CityID" integer,
    "PinCode" character varying(10),
    "MobileNo" character varying(20) NOT NULL,
    "EmergencyContactNo" character varying(20),
    "ReferredBy" character varying(250),
    "Description" character varying(250),
    "HospitalID" integer NOT NULL,
    "UserID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL,
    "DOB" timestamp(3) without time zone NOT NULL,
    "Age" integer NOT NULL,
    "Height" numeric(5,2)
);


ALTER TABLE public."Patient" OWNER TO jdsmac;

--
-- Name: Patient_PatientID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."Patient_PatientID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patient_PatientID_seq" OWNER TO jdsmac;

--
-- Name: Patient_PatientID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."Patient_PatientID_seq" OWNED BY public."Patient"."PatientID";


--
-- Name: Prescription; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."Prescription" (
    "PrescriptionID" integer NOT NULL,
    "OPDID" integer NOT NULL,
    "Notes" text,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Prescription" OWNER TO jdsmac;

--
-- Name: PrescriptionMedicine; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."PrescriptionMedicine" (
    "ID" integer NOT NULL,
    "PrescriptionID" integer NOT NULL,
    "MedicineID" integer,
    "MedicineName" character varying(250),
    "Dosage" character varying(100) NOT NULL,
    "Frequency" character varying(100) NOT NULL,
    "Duration" character varying(100) NOT NULL,
    "Instructions" character varying(250),
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PrescriptionMedicine" OWNER TO jdsmac;

--
-- Name: PrescriptionMedicine_ID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."PrescriptionMedicine_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PrescriptionMedicine_ID_seq" OWNER TO jdsmac;

--
-- Name: PrescriptionMedicine_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."PrescriptionMedicine_ID_seq" OWNED BY public."PrescriptionMedicine"."ID";


--
-- Name: Prescription_PrescriptionID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."Prescription_PrescriptionID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Prescription_PrescriptionID_seq" OWNER TO jdsmac;

--
-- Name: Prescription_PrescriptionID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."Prescription_PrescriptionID_seq" OWNED BY public."Prescription"."PrescriptionID";


--
-- Name: Receipt; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."Receipt" (
    "ReceiptID" integer NOT NULL,
    "ReceiptNo" character varying(250),
    "ReceiptDate" timestamp(3) without time zone NOT NULL,
    "OPDID" integer NOT NULL,
    "AmountPaid" numeric(10,2) NOT NULL,
    "PaymentModeID" integer NOT NULL,
    "ReferenceNo" character varying(250),
    "ReferenceDate" timestamp(3) without time zone,
    "CancellationDateTime" timestamp(3) without time zone,
    "CancellationByUserID" integer,
    "CancellationRemarks" character varying(500),
    "Description" character varying(250),
    "UserID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Receipt" OWNER TO jdsmac;

--
-- Name: ReceiptTran; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."ReceiptTran" (
    "ReceiptTranID" integer NOT NULL,
    "ReceiptID" integer NOT NULL,
    "SubTreatmentTypeID" integer NOT NULL,
    "Rate" numeric(10,2) NOT NULL,
    "Quantity" integer DEFAULT 1 NOT NULL,
    "Amount" numeric(10,2) NOT NULL,
    "Description" character varying(250),
    "UserID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ReceiptTran" OWNER TO jdsmac;

--
-- Name: ReceiptTran_ReceiptTranID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."ReceiptTran_ReceiptTranID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReceiptTran_ReceiptTranID_seq" OWNER TO jdsmac;

--
-- Name: ReceiptTran_ReceiptTranID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."ReceiptTran_ReceiptTranID_seq" OWNED BY public."ReceiptTran"."ReceiptTranID";


--
-- Name: Receipt_ReceiptID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."Receipt_ReceiptID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Receipt_ReceiptID_seq" OWNER TO jdsmac;

--
-- Name: Receipt_ReceiptID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."Receipt_ReceiptID_seq" OWNED BY public."Receipt"."ReceiptID";


--
-- Name: SubTreatmentType; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."SubTreatmentType" (
    "SubTreatmentTypeID" integer NOT NULL,
    "SubTreatmentTypeName" character varying(250) NOT NULL,
    "TreatmentTypeID" integer NOT NULL,
    "Rate" numeric(10,2) NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "Description" character varying(250),
    "UserID" integer,
    "AccountID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SubTreatmentType" OWNER TO jdsmac;

--
-- Name: SubTreatmentType_SubTreatmentTypeID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."SubTreatmentType_SubTreatmentTypeID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SubTreatmentType_SubTreatmentTypeID_seq" OWNER TO jdsmac;

--
-- Name: SubTreatmentType_SubTreatmentTypeID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."SubTreatmentType_SubTreatmentTypeID_seq" OWNED BY public."SubTreatmentType"."SubTreatmentTypeID";


--
-- Name: TreatmentType; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."TreatmentType" (
    "TreatmentTypeID" integer NOT NULL,
    "TreatmentTypeName" character varying(250) NOT NULL,
    "TreatmentTypeShortName" character varying(50),
    "HospitalID" integer NOT NULL,
    "Description" character varying(250),
    "UserID" integer,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TreatmentType" OWNER TO jdsmac;

--
-- Name: TreatmentType_TreatmentTypeID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."TreatmentType_TreatmentTypeID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TreatmentType_TreatmentTypeID_seq" OWNER TO jdsmac;

--
-- Name: TreatmentType_TreatmentTypeID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."TreatmentType_TreatmentTypeID_seq" OWNED BY public."TreatmentType"."TreatmentTypeID";


--
-- Name: User; Type: TABLE; Schema: public; Owner: jdsmac
--

CREATE TABLE public."User" (
    "UserID" integer NOT NULL,
    "Name" text NOT NULL,
    "Email" text NOT NULL,
    "Password" text NOT NULL,
    "Role" public."Role" NOT NULL,
    "Created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Modified" timestamp(3) without time zone NOT NULL,
    "Status" text DEFAULT 'PENDING'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO jdsmac;

--
-- Name: User_UserID_seq; Type: SEQUENCE; Schema: public; Owner: jdsmac
--

CREATE SEQUENCE public."User_UserID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_UserID_seq" OWNER TO jdsmac;

--
-- Name: User_UserID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jdsmac
--

ALTER SEQUENCE public."User_UserID_seq" OWNED BY public."User"."UserID";


--
-- Name: DiagnosisType DiagnosisTypeID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."DiagnosisType" ALTER COLUMN "DiagnosisTypeID" SET DEFAULT nextval('public."DiagnosisType_DiagnosisTypeID_seq"'::regclass);


--
-- Name: Doctor DoctorID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Doctor" ALTER COLUMN "DoctorID" SET DEFAULT nextval('public."Doctor_DoctorID_seq"'::regclass);


--
-- Name: DoctorAvailability AvailabilityID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."DoctorAvailability" ALTER COLUMN "AvailabilityID" SET DEFAULT nextval('public."DoctorAvailability_AvailabilityID_seq"'::regclass);


--
-- Name: Hospital HospitalID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Hospital" ALTER COLUMN "HospitalID" SET DEFAULT nextval('public."Hospital_HospitalID_seq"'::regclass);


--
-- Name: LabOrder OrderID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrder" ALTER COLUMN "OrderID" SET DEFAULT nextval('public."LabOrder_OrderID_seq"'::regclass);


--
-- Name: LabOrderItem OrderItemID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrderItem" ALTER COLUMN "OrderItemID" SET DEFAULT nextval('public."LabOrderItem_OrderItemID_seq"'::regclass);


--
-- Name: LabTest TestID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabTest" ALTER COLUMN "TestID" SET DEFAULT nextval('public."LabTest_TestID_seq"'::regclass);


--
-- Name: LabTestCategory CategoryID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabTestCategory" ALTER COLUMN "CategoryID" SET DEFAULT nextval('public."LabTestCategory_CategoryID_seq"'::regclass);


--
-- Name: Medicine MedicineID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Medicine" ALTER COLUMN "MedicineID" SET DEFAULT nextval('public."Medicine_MedicineID_seq"'::regclass);


--
-- Name: OPD OPDID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPD" ALTER COLUMN "OPDID" SET DEFAULT nextval('public."OPD_OPDID_seq"'::regclass);


--
-- Name: OPDDiagnosisType OPDDiagnosisTypeID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPDDiagnosisType" ALTER COLUMN "OPDDiagnosisTypeID" SET DEFAULT nextval('public."OPDDiagnosisType_OPDDiagnosisTypeID_seq"'::regclass);


--
-- Name: Patient PatientID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Patient" ALTER COLUMN "PatientID" SET DEFAULT nextval('public."Patient_PatientID_seq"'::regclass);


--
-- Name: Prescription PrescriptionID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Prescription" ALTER COLUMN "PrescriptionID" SET DEFAULT nextval('public."Prescription_PrescriptionID_seq"'::regclass);


--
-- Name: PrescriptionMedicine ID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."PrescriptionMedicine" ALTER COLUMN "ID" SET DEFAULT nextval('public."PrescriptionMedicine_ID_seq"'::regclass);


--
-- Name: Receipt ReceiptID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Receipt" ALTER COLUMN "ReceiptID" SET DEFAULT nextval('public."Receipt_ReceiptID_seq"'::regclass);


--
-- Name: ReceiptTran ReceiptTranID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."ReceiptTran" ALTER COLUMN "ReceiptTranID" SET DEFAULT nextval('public."ReceiptTran_ReceiptTranID_seq"'::regclass);


--
-- Name: SubTreatmentType SubTreatmentTypeID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."SubTreatmentType" ALTER COLUMN "SubTreatmentTypeID" SET DEFAULT nextval('public."SubTreatmentType_SubTreatmentTypeID_seq"'::regclass);


--
-- Name: TreatmentType TreatmentTypeID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."TreatmentType" ALTER COLUMN "TreatmentTypeID" SET DEFAULT nextval('public."TreatmentType_TreatmentTypeID_seq"'::regclass);


--
-- Name: User UserID; Type: DEFAULT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."User" ALTER COLUMN "UserID" SET DEFAULT nextval('public."User_UserID_seq"'::regclass);


--
-- Data for Name: DiagnosisType; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."DiagnosisType" ("DiagnosisTypeID", "DiagnosisTypeName", "DiagnosisTypeShortName", "IsActive", "HospitalID", "Description", "UserID", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: Doctor; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."Doctor" ("DoctorID", "HospitalID", "Created", "Modified", "AboutDoctor", "Address", "ConsultationFee", "DOB", "Department", "Email", "ExperienceYears", "FirstName", "Gender", "IsEmergencyAvailable", "LastName", "MobileNo", "Qualification", "RegistrationCouncil", "RegistrationNo", "Specialization", "UserID") FROM stdin;
\.


--
-- Data for Name: DoctorAvailability; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."DoctorAvailability" ("AvailabilityID", "DoctorID", "DayOfWeek", "FromTime", "ToTime", "MaxPatients", "IsAvailable", "IsEmergencyOnly", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: Hospital; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."Hospital" ("HospitalID", "HospitalName", "Address", "OpeningDate", "Created", "Modified", "DefaultPaymentModeID", "Description", "IsRateEnableInReceipt", "IsRegistrationFeeEnableInOPD", "OpeningOPDNo", "OpeningPatientNo", "OpeningReceiptNo", "RegistrationCharge", "RegistrationValidityMonths", "UserID") FROM stdin;
\.


--
-- Data for Name: LabOrder; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."LabOrder" ("OrderID", "OPDID", "PatientID", "DoctorID", "OrderDate", "Status", "TotalAmount", "Notes", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: LabOrderItem; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."LabOrderItem" ("OrderItemID", "OrderID", "TestID", "Price", "ResultValue", "ResultNotes", "Status", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: LabTest; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."LabTest" ("TestID", "TestName", "TestCode", "CategoryID", "Price", "IsActive", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: LabTestCategory; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."LabTestCategory" ("CategoryID", "CategoryName", "Description", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: Medicine; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."Medicine" ("MedicineID", "Name", "GenericName", "Category", "Manufacturer", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: OPD; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."OPD" ("OPDID", "OPDNo", "OPDDateTime", "PatientID", "TreatedByDoctorID", "IsFollowUpCase", "RegistrationFee", "Description", "UserID", "OLDOPDNo", "Created", "Modified", "ConsultationEnd", "ConsultationStart", "FollowUpDate", "IsEmergency", "Status", "TokenNo", "BP_Diastolic", "BP_Systolic", "Height", "Pulse", "SpO2", "Temperature", "Weight") FROM stdin;
\.


--
-- Data for Name: OPDDiagnosisType; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."OPDDiagnosisType" ("OPDDiagnosisTypeID", "OPDID", "DiagnosisTypeID", "Description", "UserID", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: Patient; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."Patient" ("PatientID", "PatientName", "PatientNo", "RegistrationDateTime", "BloodGroup", "Gender", "Occupation", "Address", "StateID", "CityID", "PinCode", "MobileNo", "EmergencyContactNo", "ReferredBy", "Description", "HospitalID", "UserID", "Created", "Modified", "DOB", "Age", "Height") FROM stdin;
\.


--
-- Data for Name: Prescription; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."Prescription" ("PrescriptionID", "OPDID", "Notes", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: PrescriptionMedicine; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."PrescriptionMedicine" ("ID", "PrescriptionID", "MedicineID", "MedicineName", "Dosage", "Frequency", "Duration", "Instructions", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."Receipt" ("ReceiptID", "ReceiptNo", "ReceiptDate", "OPDID", "AmountPaid", "PaymentModeID", "ReferenceNo", "ReferenceDate", "CancellationDateTime", "CancellationByUserID", "CancellationRemarks", "Description", "UserID", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: ReceiptTran; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."ReceiptTran" ("ReceiptTranID", "ReceiptID", "SubTreatmentTypeID", "Rate", "Quantity", "Amount", "Description", "UserID", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: SubTreatmentType; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."SubTreatmentType" ("SubTreatmentTypeID", "SubTreatmentTypeName", "TreatmentTypeID", "Rate", "IsActive", "Description", "UserID", "AccountID", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: TreatmentType; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."TreatmentType" ("TreatmentTypeID", "TreatmentTypeName", "TreatmentTypeShortName", "HospitalID", "Description", "UserID", "Created", "Modified") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: jdsmac
--

COPY public."User" ("UserID", "Name", "Email", "Password", "Role", "Created", "Modified", "Status") FROM stdin;
\.


--
-- Name: DiagnosisType_DiagnosisTypeID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."DiagnosisType_DiagnosisTypeID_seq"', 1, false);


--
-- Name: DoctorAvailability_AvailabilityID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."DoctorAvailability_AvailabilityID_seq"', 1, false);


--
-- Name: Doctor_DoctorID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."Doctor_DoctorID_seq"', 1, false);


--
-- Name: Hospital_HospitalID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."Hospital_HospitalID_seq"', 1, false);


--
-- Name: LabOrderItem_OrderItemID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."LabOrderItem_OrderItemID_seq"', 1, false);


--
-- Name: LabOrder_OrderID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."LabOrder_OrderID_seq"', 1, false);


--
-- Name: LabTestCategory_CategoryID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."LabTestCategory_CategoryID_seq"', 1, false);


--
-- Name: LabTest_TestID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."LabTest_TestID_seq"', 1, false);


--
-- Name: Medicine_MedicineID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."Medicine_MedicineID_seq"', 1, false);


--
-- Name: OPDDiagnosisType_OPDDiagnosisTypeID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."OPDDiagnosisType_OPDDiagnosisTypeID_seq"', 1, false);


--
-- Name: OPD_OPDID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."OPD_OPDID_seq"', 1, false);


--
-- Name: Patient_PatientID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."Patient_PatientID_seq"', 1, false);


--
-- Name: PrescriptionMedicine_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."PrescriptionMedicine_ID_seq"', 1, false);


--
-- Name: Prescription_PrescriptionID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."Prescription_PrescriptionID_seq"', 1, false);


--
-- Name: ReceiptTran_ReceiptTranID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."ReceiptTran_ReceiptTranID_seq"', 1, false);


--
-- Name: Receipt_ReceiptID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."Receipt_ReceiptID_seq"', 1, false);


--
-- Name: SubTreatmentType_SubTreatmentTypeID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."SubTreatmentType_SubTreatmentTypeID_seq"', 1, false);


--
-- Name: TreatmentType_TreatmentTypeID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."TreatmentType_TreatmentTypeID_seq"', 1, false);


--
-- Name: User_UserID_seq; Type: SEQUENCE SET; Schema: public; Owner: jdsmac
--

SELECT pg_catalog.setval('public."User_UserID_seq"', 1, false);


--
-- Name: DiagnosisType DiagnosisType_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."DiagnosisType"
    ADD CONSTRAINT "DiagnosisType_pkey" PRIMARY KEY ("DiagnosisTypeID");


--
-- Name: DoctorAvailability DoctorAvailability_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."DoctorAvailability"
    ADD CONSTRAINT "DoctorAvailability_pkey" PRIMARY KEY ("AvailabilityID");


--
-- Name: Doctor Doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Doctor"
    ADD CONSTRAINT "Doctor_pkey" PRIMARY KEY ("DoctorID");


--
-- Name: Hospital Hospital_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Hospital"
    ADD CONSTRAINT "Hospital_pkey" PRIMARY KEY ("HospitalID");


--
-- Name: LabOrderItem LabOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrderItem"
    ADD CONSTRAINT "LabOrderItem_pkey" PRIMARY KEY ("OrderItemID");


--
-- Name: LabOrder LabOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrder"
    ADD CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("OrderID");


--
-- Name: LabTestCategory LabTestCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabTestCategory"
    ADD CONSTRAINT "LabTestCategory_pkey" PRIMARY KEY ("CategoryID");


--
-- Name: LabTest LabTest_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabTest"
    ADD CONSTRAINT "LabTest_pkey" PRIMARY KEY ("TestID");


--
-- Name: Medicine Medicine_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Medicine"
    ADD CONSTRAINT "Medicine_pkey" PRIMARY KEY ("MedicineID");


--
-- Name: OPDDiagnosisType OPDDiagnosisType_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPDDiagnosisType"
    ADD CONSTRAINT "OPDDiagnosisType_pkey" PRIMARY KEY ("OPDDiagnosisTypeID");


--
-- Name: OPD OPD_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPD"
    ADD CONSTRAINT "OPD_pkey" PRIMARY KEY ("OPDID");


--
-- Name: Patient Patient_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_pkey" PRIMARY KEY ("PatientID");


--
-- Name: PrescriptionMedicine PrescriptionMedicine_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."PrescriptionMedicine"
    ADD CONSTRAINT "PrescriptionMedicine_pkey" PRIMARY KEY ("ID");


--
-- Name: Prescription Prescription_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Prescription"
    ADD CONSTRAINT "Prescription_pkey" PRIMARY KEY ("PrescriptionID");


--
-- Name: ReceiptTran ReceiptTran_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."ReceiptTran"
    ADD CONSTRAINT "ReceiptTran_pkey" PRIMARY KEY ("ReceiptTranID");


--
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY ("ReceiptID");


--
-- Name: SubTreatmentType SubTreatmentType_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."SubTreatmentType"
    ADD CONSTRAINT "SubTreatmentType_pkey" PRIMARY KEY ("SubTreatmentTypeID");


--
-- Name: TreatmentType TreatmentType_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."TreatmentType"
    ADD CONSTRAINT "TreatmentType_pkey" PRIMARY KEY ("TreatmentTypeID");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserID");


--
-- Name: DoctorAvailability_DoctorID_DayOfWeek_key; Type: INDEX; Schema: public; Owner: jdsmac
--

CREATE UNIQUE INDEX "DoctorAvailability_DoctorID_DayOfWeek_key" ON public."DoctorAvailability" USING btree ("DoctorID", "DayOfWeek");


--
-- Name: LabTest_TestCode_key; Type: INDEX; Schema: public; Owner: jdsmac
--

CREATE UNIQUE INDEX "LabTest_TestCode_key" ON public."LabTest" USING btree ("TestCode");


--
-- Name: Prescription_OPDID_key; Type: INDEX; Schema: public; Owner: jdsmac
--

CREATE UNIQUE INDEX "Prescription_OPDID_key" ON public."Prescription" USING btree ("OPDID");


--
-- Name: User_Email_key; Type: INDEX; Schema: public; Owner: jdsmac
--

CREATE UNIQUE INDEX "User_Email_key" ON public."User" USING btree ("Email");


--
-- Name: DiagnosisType DiagnosisType_HospitalID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."DiagnosisType"
    ADD CONSTRAINT "DiagnosisType_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES public."Hospital"("HospitalID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DoctorAvailability DoctorAvailability_DoctorID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."DoctorAvailability"
    ADD CONSTRAINT "DoctorAvailability_DoctorID_fkey" FOREIGN KEY ("DoctorID") REFERENCES public."Doctor"("DoctorID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Doctor Doctor_HospitalID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Doctor"
    ADD CONSTRAINT "Doctor_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES public."Hospital"("HospitalID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LabOrderItem LabOrderItem_OrderID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrderItem"
    ADD CONSTRAINT "LabOrderItem_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES public."LabOrder"("OrderID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LabOrderItem LabOrderItem_TestID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrderItem"
    ADD CONSTRAINT "LabOrderItem_TestID_fkey" FOREIGN KEY ("TestID") REFERENCES public."LabTest"("TestID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LabOrder LabOrder_OPDID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabOrder"
    ADD CONSTRAINT "LabOrder_OPDID_fkey" FOREIGN KEY ("OPDID") REFERENCES public."OPD"("OPDID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LabTest LabTest_CategoryID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."LabTest"
    ADD CONSTRAINT "LabTest_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES public."LabTestCategory"("CategoryID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OPDDiagnosisType OPDDiagnosisType_DiagnosisTypeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPDDiagnosisType"
    ADD CONSTRAINT "OPDDiagnosisType_DiagnosisTypeID_fkey" FOREIGN KEY ("DiagnosisTypeID") REFERENCES public."DiagnosisType"("DiagnosisTypeID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OPDDiagnosisType OPDDiagnosisType_OPDID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPDDiagnosisType"
    ADD CONSTRAINT "OPDDiagnosisType_OPDID_fkey" FOREIGN KEY ("OPDID") REFERENCES public."OPD"("OPDID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OPD OPD_PatientID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPD"
    ADD CONSTRAINT "OPD_PatientID_fkey" FOREIGN KEY ("PatientID") REFERENCES public."Patient"("PatientID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OPD OPD_TreatedByDoctorID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."OPD"
    ADD CONSTRAINT "OPD_TreatedByDoctorID_fkey" FOREIGN KEY ("TreatedByDoctorID") REFERENCES public."Doctor"("DoctorID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Patient Patient_HospitalID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES public."Hospital"("HospitalID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PrescriptionMedicine PrescriptionMedicine_MedicineID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."PrescriptionMedicine"
    ADD CONSTRAINT "PrescriptionMedicine_MedicineID_fkey" FOREIGN KEY ("MedicineID") REFERENCES public."Medicine"("MedicineID") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PrescriptionMedicine PrescriptionMedicine_PrescriptionID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."PrescriptionMedicine"
    ADD CONSTRAINT "PrescriptionMedicine_PrescriptionID_fkey" FOREIGN KEY ("PrescriptionID") REFERENCES public."Prescription"("PrescriptionID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Prescription Prescription_OPDID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Prescription"
    ADD CONSTRAINT "Prescription_OPDID_fkey" FOREIGN KEY ("OPDID") REFERENCES public."OPD"("OPDID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReceiptTran ReceiptTran_ReceiptID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."ReceiptTran"
    ADD CONSTRAINT "ReceiptTran_ReceiptID_fkey" FOREIGN KEY ("ReceiptID") REFERENCES public."Receipt"("ReceiptID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReceiptTran ReceiptTran_SubTreatmentTypeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."ReceiptTran"
    ADD CONSTRAINT "ReceiptTran_SubTreatmentTypeID_fkey" FOREIGN KEY ("SubTreatmentTypeID") REFERENCES public."SubTreatmentType"("SubTreatmentTypeID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_OPDID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_OPDID_fkey" FOREIGN KEY ("OPDID") REFERENCES public."OPD"("OPDID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SubTreatmentType SubTreatmentType_TreatmentTypeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."SubTreatmentType"
    ADD CONSTRAINT "SubTreatmentType_TreatmentTypeID_fkey" FOREIGN KEY ("TreatmentTypeID") REFERENCES public."TreatmentType"("TreatmentTypeID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TreatmentType TreatmentType_HospitalID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jdsmac
--

ALTER TABLE ONLY public."TreatmentType"
    ADD CONSTRAINT "TreatmentType_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES public."Hospital"("HospitalID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: jdsmac
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict fDu2c850Jf9CuWMzmH3hfeleXzc33JjnFdZZ2PiAmPhGeb9wvmtnBYYmOhGfNyk

