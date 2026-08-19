"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Hero3DAnimation } from "@/components/Hero3DAnimation";
import {
  GraduationCap,
  Users,
  Search,
  Menu,
  X,
  PanelLeft,
  Send,
  LogOut
} from "lucide-react";

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

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Students");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<"school" | "student" | null>(null);
  const [schoolName, setSchoolName] = useState("School Portal");

  // Student Modal state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentGmail, setStudentGmail] = useState("");
  const [studentsList, setStudentsList] = useState<{ id?: number; gmail: string }[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  // Fetch current logged in school/student and its students
  const fetchStudents = async () => {
    try {
      if (!session?.user) return;

      if (session.user.role === "student") {
        setUserRole("student");
      } else {
        setUserRole("school");
      }

      if (session.user.school_name) {
        setSchoolName(session.user.school_name);
      }

      const schoolId = session.user.school_id;

      if (schoolId) {
        const { data, error } = await supabase
          .from("student")
          .select("*")
          .eq("school_id", schoolId);

        if (data && !error) {
          setStudentsList(data);
        }
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [session?.user?.school_id]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentGmail.trim()) return;

    setAddLoading(true);
    setModalMessage(null);

    try {
      // Get school_id of currently logged in school
      const schoolId = session?.user?.school_id;

      if (!schoolId) {
        setModalMessage("Error: school_id not found in user session.");
        setAddLoading(false);
        return;
      }

      const targetGmail = studentGmail.trim().toLowerCase();

      // Check if student gmail already exists in the table
      const { data: existingStudent, error: checkError } = await supabase
        .from("student")
        .select("id")
        .eq("gmail", targetGmail)
        .maybeSingle();

      if (existingStudent) {
        setModalMessage("Error: Gmail already exists!");
        setAddLoading(false);
        return;
      }

      // Insert into 'student' table
      const { data, error } = await supabase
        .from("student")
        .insert([
          {
            gmail: targetGmail,
            school_id: schoolId,
          },
        ])
        .select();

      if (error) {
        if (error.code === "23505") {
          setModalMessage("Error: Gmail already exists!");
        } else {
          console.error("Supabase Add Student Error:", error);
          setModalMessage(`Error: ${error.message}`);
        }
      } else {
        setModalMessage("Student added successfully!");
        setStudentGmail("");
        fetchStudents(); // Refresh list
      }
    } catch (err: any) {
      setModalMessage("Failed to add student. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

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
    }, 1000);

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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-row selection:bg-slate-200">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {userRole !== "student" && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      {userRole !== "student" && (
        <aside
          className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 shadow-sm flex flex-col transition-all duration-300 shrink-0 ${isCollapsed ? "md:w-20" : "md:w-64"
            } w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Logo & Brand Header */}
          <div className={`h-[73px] px-4 sm:px-6 flex items-center border-b border-slate-200 shrink-0 ${isCollapsed ? "justify-center" : "justify-between"
            }`}>
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-[#006783] flex items-center justify-center text-white font-bold shadow-xs shrink-0 cursor-pointer"
              >
                G
              </motion.div>
              {!isCollapsed && (
                <span className="font-bold text-slate-900 text-lg tracking-tight truncate">
                  Guider
                </span>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-500 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("Students");
                setSidebarOpen(false);
                setIsStudentModalOpen(true);
              }}
              title="Students"
              className={`group w-full flex items-center gap-3 py-3 rounded-xl font-medium transition-all text-left ${isCollapsed ? "justify-center px-0" : "px-4"
                } ${activeTab === "Students"
                  ? "bg-slate-100 border border-slate-200 text-[#006783] font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Users className="w-5 h-5 shrink-0 text-[#d96b43] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 ease-in-out" />
              {!isCollapsed && <span>Students</span>}
            </motion.button>
          </nav>
        </aside>
      )}

      {/* Main Container */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 3D Animated Background Orbs, Spheres, and Glass Badges */}
        <Hero3DAnimation />

        {/* Top Navigation Header */}
        <header className="h-[73px] bg-white border-b border-slate-200 px-6 md:px-8 shrink-0 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {userRole !== "student" && (
              <>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-800"
                  aria-label="Open Sidebar"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden md:flex p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </>
            )}
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 rounded-xl bg-[#006783] flex items-center justify-center text-white shrink-0 shadow-xs"
            >
              <GraduationCap className="w-6 h-6" />
            </motion.div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {schoolName}
            </h1>
          </div>

          {/* Logout Action */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 px-3.5 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-200"
            title="Log out"
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

      {/* Add Student Modal */}
      <AnimatePresence>
        {isStudentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl flex flex-col gap-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#006783]/10 text-[#006783] flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Add Student</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsStudentModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Notification Message */}
              <AnimatePresence mode="wait">
                {modalMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${modalMessage.startsWith("Error")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                  >
                    {modalMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Form */}
              <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Student Gmail Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={studentGmail}
                      onChange={(e) => setStudentGmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#006783] focus:ring-2 focus:ring-[#006783]/20 outline-none transition-all"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={addLoading}
                      className="bg-[#006783] hover:bg-[#004e63] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {addLoading ? "Adding..." : "Add"}
                    </motion.button>
                  </div>
                </div>
              </form>

              {/* Added Students List */}
              {studentsList.length > 0 && (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Added Students ({studentsList.length})
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence>
                      {studentsList.map((student, index) => (
                        <motion.div
                          key={student.id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm font-medium text-slate-800"
                        >
                          <span>{student.gmail}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                              if (student.id) {
                                await supabase.from("student").delete().eq("id", student.id);
                                fetchStudents();
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            Remove
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


