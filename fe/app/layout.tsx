import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";

export const metadata: Metadata = {
  title: "가계부",
  description: "간단한 가계부 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
