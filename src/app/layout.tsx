import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "UltraDrive Fleet",
  description: "Advanced Vehicle Fleet Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background antialiased">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
