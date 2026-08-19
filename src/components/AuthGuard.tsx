"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// Define protected routes that require login
const PROTECTED_ROUTES = [
  "/dashboard",
  "/student-dashboard",
  "/topic-detail",
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (status === "unauthenticated" && isProtected) {
      router.replace("/login");
    }
  }, [status, isProtected, router]);

  // Prevent flash of protected content while checking auth status
  if (isProtected && status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#006783]"></div>
      </div>
    );
  }

  if (isProtected && status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

