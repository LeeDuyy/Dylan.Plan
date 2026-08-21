"use client";

import { useEffect } from "react";

const AUTO_DISMISS_MS = 4000; // DEC-012: tự đóng sau vài giây, không cần bấm đóng thủ công.

export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 50,
        maxWidth: 360,
        padding: "12px 16px",
        borderRadius: 14,
        background: "var(--surface)",
        color: "var(--text)",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--line)"
      }}
    >
      {message}
    </div>
  );
}
