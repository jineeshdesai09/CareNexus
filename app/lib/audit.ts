import { prisma } from "@/lib/prisma";

export async function recordAuditLog(data: {
    Action: string;
    Module: string;
    UserID: number;
    Details?: string;
}) {
    try {
        await prisma.auditLog.create({
            data: {
                Action: data.Action,
                Module: data.Module,
                UserID: data.UserID,
                Details: data.Details,
            },
        });
    } catch (error) {
        console.error("CRITICAL: Failed to record audit log:", error);
    }
}
