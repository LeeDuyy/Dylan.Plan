import type { Metadata } from "next";
import "@vn-dylan/ui/styles.css";
import "./globals.css";

import { RootClient } from "@/components/shared/RootClient";
import { UserSessionProvider } from "@/components/shared/UserSessionContext";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Dylan Plan Dashboard",
  description: "Dashboard Next.js cho kế hoạch định hướng sự nghiệp và thu chi cá nhân của Dylan.",
  icons: { icon: "/favicon.svg" }
};

// Đặt class `.dark` sớm (trước hydrate) để không chớp nền — khớp logic của
// `useDarkMode` (@vn-dylan/utils): key localStorage `dyl-color-mode`, fallback theo
// `prefers-color-scheme`.
const THEME_INIT = `try{var m=localStorage.getItem('dyl-color-mode');if(m==='dark'||(!m&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body suppressHydrationWarning>
        <UserSessionProvider email={session?.user?.email ?? null}>
          <RootClient>{children}</RootClient>
        </UserSessionProvider>
      </body>
    </html>
  );
}
