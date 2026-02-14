import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hiretail - Retail Marketplace",
  description: "Your trusted retail marketplace for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
