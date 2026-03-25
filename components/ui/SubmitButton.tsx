"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
}

export function SubmitButton({ children, className, loadingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`relative inline-flex items-center justify-center gap-2 ${className} ${
        pending ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {pending && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
