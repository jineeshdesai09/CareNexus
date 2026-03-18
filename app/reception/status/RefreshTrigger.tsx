"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshTrigger() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [router]);

    return null; // This component is invisible
}
