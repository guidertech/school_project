"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Search, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Hero3DAnimation } from "@/components/Hero3DAnimation";

// Terracotta Starburst Icon
function TerracottaStar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#096145"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="w-8 h-8 sm:w-10 sm:h-10 shrink-0"
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  );
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [schoolName, setSchoolName] = useState("School Portal");
  const [studentGmail, setStudentGmail] = useState("");

  useEffect(() => {
    // Verify student session and fetch school details
    const fetchStudentAndSchoolDetails = async () => {
      if (!session?.user) return;

      try {
        setStudentGmail(session.user.gmail || session.user.email || "");

        if (session.user.school_id) {
          const { data: school, error } = await supabase
            .from("schools")
            .select("school_name")
            .eq("school_id", session.user.school_id)
            .single();

          if (school && school.school_name) {
            setSchoolName(school.school_name);
          }
        }
      } catch (err) {
        console.error("Error loading student dashboard details:", err);
      }
    };

    fetchStudentAndSchoolDetails();
  }, [session]);

  interface PptItem {
    id: number;
    name: string;
    category?: string;
    topic_id?: number;
    tags?: string[] | string;
  }

  interface SuggestionResult {
    displayLabel: string;
    pptName: string;
    topic_id?: number;
    category?: string;
  }

  const [pptSuggestions, setPptSuggestions] = useState<SuggestionResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setPptSuggestions([]);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const searchDb = async () => {
      try {
        // Query Supabase presentation table live
        const { data, error } = await supabase
          .from("presentation")
          .select("id, topic_name, topic_category, topic_id, tags");

        if (error || !data) {
          if (isMounted) setPptSuggestions([]);
          return;
        }

        const results: SuggestionResult[] = [];
        const seen = new Set<string>();

        data.forEach((item: any) => {
          let cleanTags: string[] = [];

          if (Array.isArray(item.tags)) {
            cleanTags = item.tags
              .map((t: any) => String(t).replace(/^["'\s\{\}\[\]]+|["'\s\{\}\[\]]+$/g, "").trim())
              .filter(Boolean);
          } else if (typeof item.tags === "string") {
            const raw = item.tags;
            const matches = raw.match(/"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|([^\s,\{\}\[\]"']+)/g);
            if (matches) {
              cleanTags = matches
                .map((s: string) => s.replace(/^["'\s\{\}\[\]\n\r]+|["'\s\{\}\[\]\n\r]+$/g, "").trim())
                .filter((s: string) => s.length > 0 && s !== ",");
            }
          }

          // 1. Check matching tags first
          cleanTags.forEach((tag) => {
            const tagLower = tag.toLowerCase();
            if (tagLower.includes(q)) {
              if (!seen.has(tagLower)) {
                seen.add(tagLower);
                results.push({
                  displayLabel: tag,
                  pptName: item.topic_name || tag,
                  topic_id: item.topic_id || item.id,
                  category: item.topic_category,
                });
              }
            }
          });

          // 2. Check PPT name match
          const nameLower = (item.topic_name || "").toLowerCase();
          if (nameLower && nameLower.includes(q)) {
            if (!seen.has(nameLower)) {
              seen.add(nameLower);
              results.push({
                displayLabel: item.topic_name,
                pptName: item.topic_name,
                topic_id: item.topic_id || item.id,
                category: item.topic_category,
              });
            }
          }
        });

        if (isMounted) setPptSuggestions(results);
      } catch (err) {
        console.error("Search exception:", err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      searchDb();
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSuggestionClick = (item: SuggestionResult) => {
    setSearchQuery(item.displayLabel);
    setShowSuggestions(false);
    const targetUrl = item.topic_id
      ? `/topic-detail?topic_id=${item.topic_id}&query=${encodeURIComponent(item.displayLabel)}`
      : `/topic-detail?query=${encodeURIComponent(item.displayLabel)}`;
    router.push(targetUrl);
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (!q) {
      router.push(`/topic-detail?query=${encodeURIComponent("Mathematics - Fractions & Decimals")}`);
      return;
    }

    if (pptSuggestions.length > 0) {
      const firstMatch = pptSuggestions[0];
      const targetUrl = firstMatch.topic_id
        ? `/topic-detail?topic_id=${firstMatch.topic_id}&query=${encodeURIComponent(firstMatch.displayLabel)}`
        : `/topic-detail?query=${encodeURIComponent(q)}`;
      router.push(targetUrl);
    } else {
      router.push(`/topic-detail?query=${encodeURIComponent(q)}`);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-200 overflow-hidden">
      {/* 3D Animated Background Orbs, Spheres, and Glass Badges */}
      <Hero3DAnimation />

      {/* Centered Main Header (No Sidebar) */}
      <header className="h-[73px] bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-8 shrink-0 flex items-center justify-between shadow-xs relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-[#006783] flex items-center justify-center text-white shrink-0 shadow-xs"
          >
            <GraduationCap className="w-6 h-6" />
          </motion.div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
            {studentGmail ? `Logged in: ${studentGmail}` : "Student Portal"}
          </span>
        </div>

        {/* Center School Name */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight text-center truncate max-w-xs md:max-w-md">
            {schoolName}
          </h1>
        </div>

        {/* Logout Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </header>

      {/* Main Hero & Content Section */}
      <main className="relative z-10 flex-grow p-6 md:p-12 flex flex-col justify-between items-center w-full max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
        {/* Top Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full pt-4 md:pt-8 text-center flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.div
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <TerracottaStar />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl">
            Empowering Your Academic Journey with an{" "}
            <span className="text-[#096145]">
              All-in-One Digital Content Library.
            </span>
          </h1>
        </motion.div>

        {/* Search Bar in Middle of Screen */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl my-auto py-12"
        >
          {/* Central Assistant Input Box */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative w-full bg-white rounded-[28px] border border-slate-300 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] focus-within:border-[#244ebf] focus-within:ring-2 focus-within:ring-[#244ebf]/20 transition-all text-left"
          >
            {/* Text Input Area */}
            <textarea
              rows={2}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="How can I help you today? (e.g. Mathematics - Fractions)"
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base md:text-lg font-normal outline-none border-none resize-none"
            />
            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 right-0 top-full z-20 mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                >
                  <ul className="py-2">
                    {isSearching ? (
                      <li className="px-5 py-3.5 text-sm text-slate-400 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border-2 border-[#006783] border-t-transparent animate-spin" />
                        Searching topics...
                      </li>
                    ) : pptSuggestions.length > 0 ? (
                        pptSuggestions.map((item, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ backgroundColor: "#f8fafc", x: 4 }}
                          onMouseDown={() => handleSuggestionClick(item)}
                          className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-between border-b border-slate-100 last:border-none"
                        >
                          <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{item.displayLabel}</span>
                          </div>
                          {item.category && (
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                              {item.category}
                            </span>
                          )}
                        </motion.li>
                      ))
                    ) : (
                      <li className="px-5 py-3.5 text-sm text-slate-400">
                        No matching topics found in database
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

