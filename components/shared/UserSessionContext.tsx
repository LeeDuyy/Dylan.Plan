"use client";

import { createContext, useContext } from "react";

const UserSessionContext = createContext<string | null>(null);

export function UserSessionProvider({
  email,
  children
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  return <UserSessionContext.Provider value={email}>{children}</UserSessionContext.Provider>;
}

export function useUserEmail() {
  return useContext(UserSessionContext);
}
