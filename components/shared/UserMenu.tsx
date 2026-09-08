"use client";

import { Dropdown } from "@vn-dylan/ui";
import { LogOut, UserRound } from "lucide-react";
import { useRef } from "react";

import { useUserEmail } from "@/components/shared/UserSessionContext";
import { signOutAction } from "@/server/auth/actions";

export function UserMenu() {
  const email = useUserEmail();
  const formRef = useRef<HTMLFormElement>(null);

  if (!email) {
    return null;
  }

  return (
    <>
      <Dropdown
        placement="bottom-end"
        renderTitle={
          <button type="button" className="icon-button" title={email} aria-label="Menu người dùng">
            <UserRound size={18} />
          </button>
        }
      >
        <Dropdown.Item variant="header">{email}</Dropdown.Item>
        <Dropdown.Item onClick={() => formRef.current?.requestSubmit()}>
          <LogOut size={15} style={{ marginRight: 8, verticalAlign: "-2px" }} />
          Đăng xuất
        </Dropdown.Item>
      </Dropdown>
      <form action={signOutAction} hidden ref={formRef} />
    </>
  );
}
