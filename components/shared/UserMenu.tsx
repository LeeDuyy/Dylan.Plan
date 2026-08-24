"use client";

import { LogOut } from "lucide-react";

import { useUserEmail } from "@/components/shared/UserSessionContext";
import { signOutAction } from "@/server/auth/actions";

export function UserMenu() {
  const email = useUserEmail();

  if (!email) {
    return null;
  }

  return (
    <form action={signOutAction} className="user-menu">
      <span className="user-menu-email" title={email}>
        {email}
      </span>
      <button className="icon-button" title="Đăng xuất" type="submit">
        <LogOut size={18} />
      </button>
    </form>
  );
}
