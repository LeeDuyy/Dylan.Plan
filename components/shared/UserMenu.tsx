"use client";

import { Button, Dropdown } from "antd";
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
        trigger={["click"]}
        menu={{
          items: [
            { key: "email", label: email, disabled: true },
            { type: "divider" },
            {
              key: "signout",
              label: "Đăng xuất",
              icon: <LogOut size={15} />,
              onClick: () => formRef.current?.requestSubmit()
            }
          ]
        }}
      >
        <Button className="user-menu-trigger" type="text" icon={<UserRound size={18} />} title={email}>
          <span className="user-menu-email">{email}</span>
        </Button>
      </Dropdown>
      <form action={signOutAction} className="user-menu" hidden ref={formRef} />
    </>
  );
}
