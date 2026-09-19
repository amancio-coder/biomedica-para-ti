import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RedSalud•BO",
  description: "Plataforma Integral Biomédica y Regulación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}