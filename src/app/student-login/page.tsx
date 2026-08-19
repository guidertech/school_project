"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, UserCheck } from "lucide-react";
import { signIn } from "next-auth/react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [gmail, setGmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("student-credentials", {
        gmail,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Student Email not registered. Please contact your school admin.");
        setLoading(false);
        return;
      }

      router.push("/student-dashboard");
      router.refresh();
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-slate-200">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 flex justify-between items-center w-full px-6 md:px-8 py-2 h-18 shrink-0 z-50 shadow-xs">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006783] flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            EduClass Pro
          </span>
        </Link>
        <div className="flex items-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#006783] hover:underline cursor-pointer"
          >
            School Admin Login
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-[440px] rounded-2xl border border-slate-200 p-8 flex flex-col gap-8 shadow-sm">
          {/* Header Section */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-[#006783]/10 text-[#006783] flex items-center justify-center mb-1">
              <UserCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Portal Login
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Enter your registered Gmail ID to access dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Student Gmail Input */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                htmlFor="student-gmail"
              >
                Student Gmail ID
              </label>
              <input
                className="w-full bg-white border border-slate-300 rounded-xl focus:border-[#006783] focus:ring-2 focus:ring-[#006783]/20 outline-none px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all duration-150"
                id="student-gmail"
                type="email"
                placeholder="student@gmail.com"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                required
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-2">
              <button
                className="w-full bg-[#006783] hover:bg-[#004e63] active:scale-[0.98] text-white text-base font-bold py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Login as Student"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
