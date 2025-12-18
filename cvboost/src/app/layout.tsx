import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVBoost - AI-Powered Resume Optimizer",
  description: "Transform your resume with AI. Get an ATS-optimized CV tailored to any job in 60 seconds.",
  keywords: ["resume", "CV", "ATS", "job application", "AI", "career"],
  authors: [{ name: "CVBoost" }],
  openGraph: {
    title: "CVBoost - AI-Powered Resume Optimizer",
    description: "Transform your resume with AI. Get an ATS-optimized CV tailored to any job in 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
