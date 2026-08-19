"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, GraduationCap, Calendar, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "AI for Teaching", href: "/ai-for-teaching", badge: "AI Powered" },

  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-xs"
          : "bg-white/85 backdrop-blur-xs border-b border-slate-200 py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#006783] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                EduClass <span className="text-xs px-2 py-0.5 rounded-full bg-[#006783]/10 text-[#006783] border border-[#006783]/20 font-sans font-semibold">Pro</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-medium">Digital Teaching Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive
                      ? "text-[#006783] bg-white border border-slate-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="flex items-center gap-1 text-[10px] bg-[#d96b43] text-white font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl font-semibold text-sm text-[#006783] hover:bg-slate-100 transition-colors"
            >
              School Login
            </Link>
            <Link
              href="/student-login"
              className="px-4 py-2 rounded-xl font-semibold text-sm bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-colors"
            >
              Student Login
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#006783] hover:bg-[#004e63] shadow-xs transition-all duration-200 group"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Demo</span>
              <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] bg-[#d96b43] text-white font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 font-semibold text-sm text-[#006783] bg-slate-100 rounded-xl"
              >
                School Login
              </Link>
              <Link
                href="/student-login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 font-semibold text-sm text-slate-800 bg-slate-100 rounded-xl border border-slate-200"
              >
                Student Login
              </Link>
              <Link
                href="/book-a-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#006783]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Demo</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
