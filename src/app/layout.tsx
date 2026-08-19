import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthGuard } from "@/components/AuthGuard";
import { Providers } from "@/components/Providers";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

// Font definitions using standard CSS font variables
const plusJakartaSans = {
  variable: "--font-sans",
};

const outfit = {
  variable: "--font-heading",
};

export const metadata: Metadata = {
  title: {
    default: "EduClass — AI-Powered Digital Classroom & Teaching Platform for Schools",
    template: "%s | EduClass Digital Classroom Platform",
  },
  description:
    "Transform everyday classroom teaching with EduClass. One powerful teaching platform combining interactive lessons, AI tools for teachers, and seamless projector delivery.",
  keywords: [
    "Digital classroom for schools",
    "Digital teaching platform",
    "Smart classroom technology",
    "AI-powered teaching platform",
    "AI tools for teachers",
    "AI question generator",
    "AI assessment generator",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-200">
        <Providers>
          <AuthGuard>
            <LayoutWrapper>
              <PageTransition>{children}</PageTransition>
            </LayoutWrapper>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
