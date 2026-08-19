"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Public website pages where the main Navbar & Footer should be displayed
  const isPublicWebsite =
    pathname === "/" ||
    pathname === "/features" ||
    pathname === "/ai-for-teaching" ||
    pathname === "/book-a-demo";

  if (!isPublicWebsite) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
