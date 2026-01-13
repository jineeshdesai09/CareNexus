import { requireReceptionist } from "../../lib/auth";
import PatientRegistrationForm from "./PatientRegistrationForm";

export const runtime = "nodejs";

export default async function PatientRegistrationPage() {

  await requireReceptionist();

  return <PatientRegistrationForm />;
}
