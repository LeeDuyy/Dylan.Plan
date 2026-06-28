import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dylan Plan Dashboard",
  description: "Dashboard Next.js cho kế hoạch định hướng sự nghiệp và thu chi cá nhân của Dylan."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
