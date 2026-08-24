import type { Metadata } from "next";
import "./globals.css";

import { UserSessionProvider } from "@/components/shared/UserSessionContext";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Dylan Plan Dashboard",
  description: "Dashboard Next.js cho kế hoạch định hướng sự nghiệp và thu chi cá nhân của Dylan."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <UserSessionProvider email={session?.user?.email ?? null}>{children}</UserSessionProvider>
      </body>
    </html>
  );
}
