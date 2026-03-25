import { redirect } from 'next/navigation';

export default function PatientRedirect() {
  redirect('/patient/dashboard');
}
