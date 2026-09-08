"use client";

import { toast } from "@vn-dylan/ui";
import { useEffect } from "react";

export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return;
    toast.push(message, { duration: 4000 });
    onDismiss();
  }, [message, onDismiss]);

  return null;
}
