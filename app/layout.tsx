import type { Metadata } from "next";
import "./globals.css";

import { auth, signOut } from "@/auth";

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
        {session?.user?.email ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            style={{ position: "fixed", top: 12, right: 12, zIndex: 50 }}
          >
            <button
              type="submit"
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer"
              }}
            >
              Đăng xuất ({session.user.email})
            </button>
          </form>
        ) : null}
        {children}
      </body>
    </html>
  );
}
