"use client";

import { App as AntdApp } from "antd";
import { useEffect } from "react";

export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  const { message: msg } = AntdApp.useApp();

  useEffect(() => {
    if (!message) return;
    msg.open({ content: message, duration: 4 });
    onDismiss();
  }, [message, msg, onDismiss]);

  return null;
}
