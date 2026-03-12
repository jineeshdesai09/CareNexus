import PatientDirectory from "./PatientDirectory";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function Page() {
    const user = await getCurrentUser();
    if (!user || user.Role !== "RECEPTIONIST") {
        redirect("/login");
    }

    return <PatientDirectory />;
}
