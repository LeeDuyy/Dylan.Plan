import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppThemeProvider } from "@/components/shared/AppThemeProvider";
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
        <AntdRegistry>
          <UserSessionProvider email={session?.user?.email ?? null}>
            <AppThemeProvider>{children}</AppThemeProvider>
          </UserSessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
