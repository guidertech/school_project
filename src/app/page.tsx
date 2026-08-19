"use client";
import { SiteIntroPreloader } from "@/components/SiteIntroPreloader";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Laptop,
  Globe,
  Projector,
  School,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Brain,
  Users,
  ChevronDown,
  ChevronUp,
  Sliders,
  FileText
} from "lucide-react";

// Starburst icon matching exact emerald #096145 from dashboard
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

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"laptop" | "webapp" | "projector" | "classroom">("laptop");

  const faqs = [
    {
      q: "What equipment do schools need to use EduClass?",
      a: "All a school needs is a standard laptop for the teacher, an internet connection, and a projector or interactive TV in the classroom. No expensive specialized hardware is required."
    },
    {
      q: "How does the AI Teaching Assistant help teachers save time?",
      a: "Our AI Assistant generates custom chapter questions, quizzes, homework assignments, and lesson summaries in under 30 seconds according to your specific curriculum standards."
    },
    {
      q: "Can offline content be delivered during internet outages?",
      a: "Yes! EduClass caches active lesson presentations, worksheets, and interactive media directly on the teacher's laptop so teaching never stops."
    },
    {
      q: "Is EduClass suitable for primary and high school grades?",
      a: "Absolutely. EduClass comes with grade-tailored visual templates, interactive diagrams, and subject modules covering K-12 STEM, languages, humanities, and social sciences."
    },
    {
      q: "How quickly can our school onboard our teaching staff?",
      a: "Teachers can get started in less than 15 minutes! The interface is intentionally designed to mirror intuitive presentation tools with zero learning curve."
    }
  ];

  return (
    <>
      {/* BeeToGreen Style High-End Typography Intro Preloader */}
      <SiteIntroPreloader />

      <div className="relative pt-24 pb-16 overflow-hidden bg-[#f8fafc]">

        {/* SECTION 1: HERO */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-20 max-w-7xl mx-auto text-center">

          {/* Starburst icon from dashboard */}
          <div className="flex justify-center mb-4 animate-slide-down">
            <TerracottaStar />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-xs mb-6 animate-slide-up-1">
            <Sparkles className="w-4 h-4 text-[#d96b43]" />
            <span className="text-xs sm:text-sm font-semibold text-[#006783]">
              AI-Powered Digital Teaching Platform for Modern Schools
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15] max-w-5xl mx-auto animate-slide-up-1">
            Transform Learning with One Powerful{" "}
            <span className="text-[#096145]">
              Teaching Platform.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed animate-slide-up-2">
            Empower teachers to deliver interactive digital lessons, instantly generate AI assessments, and project high-impact visual learning directly to every classroom.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-3">
            <Link
              href="/book-a-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-white bg-[#006783] hover:bg-[#004e63] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>Book a Free School Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/features"
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5 text-[#006783]" />
              <span>Explore Platform Features</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-semibold animate-slide-up-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#096145]" />
              <span>100% Projector & Smart TV Compatible</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#096145]" />
              <span>AI Question & Homework Generators</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#096145]" />
              <span>Zero Complex Hardware Required</span>
            </div>
          </div>

          {/* Product Interactive UI Showcase Mockup */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-3 bg-white border border-slate-300 shadow-xl animate-scale-up">
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
              {/* Window Header */}
              <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-500">educlass.school/teacher-dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#006783] bg-[#006783]/10 px-3 py-1 rounded-full border border-[#006783]/20 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#096145] animate-ping" />
                  Classroom Live Stream Active
                </div>
              </div>

              {/* Simulated Live Interface */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Sidebar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classroom Navigation</span>
                    <span className="text-xs bg-[#006783]/10 text-[#006783] px-2 py-0.5 rounded font-bold">Grade 8A</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-[#006783] text-white font-bold text-xs flex items-center justify-between shadow-xs">
                      <span>1. Cell Structure & Organelles</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center justify-between cursor-pointer font-medium">
                      <span>2. Photosynthesis Process</span>
                      <span className="text-[10px] text-slate-500">12 slides</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center justify-between cursor-pointer font-medium">
                      <span>3. Plant vs Animal Cells</span>
                      <span className="text-[10px] text-slate-500">8 slides</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-[#d96b43] mb-2 flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5" /> AI Assistant Status
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs leading-relaxed font-medium">
                      "Generated 5 multiple choice questions on Mitochondria."
                    </div>
                  </div>
                </div>

                {/* Main Presentation View */}
                <div className="md:col-span-2 bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-[#006783] bg-[#006783]/10 px-2.5 py-1 rounded-md font-bold">
                        Interactive Visual Slide #4
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                        <Projector className="w-3.5 h-3.5 text-[#006783]" /> Projector View Ready
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mitochondria: The Powerhouse of the Cell</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      Converts ATP energy through cellular respiration. Click interactive hotspots to inspect membrane structures.
                    </p>

                    {/* Visual Graphic Mockup */}
                    <div className="h-44 rounded-lg bg-slate-100 border border-slate-200 p-4 flex items-center justify-center relative overflow-hidden">
                      <div className="w-36 h-22 rounded-full bg-[#006783]/20 border-2 border-[#006783] flex items-center justify-center relative animate-pulse">
                        <div className="w-24 h-12 rounded-full bg-[#d96b43]/30 border border-[#d96b43] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#006783] tracking-wider">ATP ENERGY</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-md bg-[#006783] text-white text-xs font-bold shadow-xs">
                        Generate AI Quiz
                      </button>
                      <button className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">
                        Send Homework
                      </button>
                    </div>
                    <span className="text-xs text-[#096145] font-bold">Synced with Classroom Screen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT IS THE PLATFORM? */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#006783] mb-3">All-In-One Solution</h2>
            <p className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
              What is the EduClass Platform?
            </p>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              EduClass bridges the gap between teacher laptops and classroom display screens. It combines digital curriculum delivery, interactive tools, and automated AI assistance into a single unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-[#006783] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#006783]/10 flex items-center justify-center text-[#006783] mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Digital Curriculum Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access pre-loaded interactive lessons, video modules, 3D simulations, and presentation decks optimized for high-impact visual teaching.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-[#d96b43] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#d96b43]/10 flex items-center justify-center text-[#d96b43] mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Co-Pilot for Teachers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create instant practice questions, customized homework sheets, and graded assessments tailored precisely to your lesson topic in seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-[#096145] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#096145]/10 flex items-center justify-center text-[#096145] mb-6">
                <Projector className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Projector Interface</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Designed specifically to display crisp, clutter-free content on classroom projectors, interactive panels, and smart boards without hassle.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 & 10: HOW IT WORKS */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200 my-10 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1 rounded-full bg-[#006783]/10 text-[#006783] border border-[#006783]/20 text-xs font-bold uppercase tracking-wider">
              Simple 4-Step Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mt-4">
              How It Works in Your School
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              From the teacher's laptop directly to student engagement in 4 seamless steps.
            </p>
          </div>

          {/* Step Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { id: "laptop", step: "01", icon: Laptop, title: "Teacher Laptop", desc: "Open browser on laptop" },
              { id: "webapp", step: "02", icon: Globe, title: "Web App", desc: "Select class & lesson" },
              { id: "projector", step: "03", icon: Projector, title: "Projector Screen", desc: "Cast clear visuals" },
              { id: "classroom", step: "04", icon: School, title: "Classroom", desc: "Engage students live" },
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeWorkflowTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveWorkflowTab(item.id as any)}
                  className={`p-5 rounded-xl text-left border transition-all cursor-pointer ${isActive
                    ? "bg-slate-50 border-[#006783] shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-bold ${isActive ? "text-[#006783]" : "text-slate-400"}`}>
                      {item.step}
                    </span>
                    <IconComponent className={`w-5 h-5 ${isActive ? "text-[#d96b43]" : "text-slate-400"}`} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Breakdown */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 space-y-4">
              <span className="text-xs font-bold font-mono text-[#006783] uppercase tracking-widest">
                Stage Breakdown
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                {activeWorkflowTab === "laptop" && "1. Connect Teacher Laptop"}
                {activeWorkflowTab === "webapp" && "2. Launch Web Application & AI"}
                {activeWorkflowTab === "projector" && "3. One-Click Projector Broadcast"}
                {activeWorkflowTab === "classroom" && "4. Interactive Classroom Delivery"}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {activeWorkflowTab === "laptop" &&
                  "Teachers open EduClass on their laptop using standard Chrome, Edge, or Safari browsers. No bulky software installation or special IT configuration required."}
                {activeWorkflowTab === "webapp" &&
                  "Teachers select their grade, subject, and chapter. They can prompt the AI co-pilot to generate instant quiz questions or custom explanation slides."}
                {activeWorkflowTab === "projector" &&
                  "With standard HDMI or wireless display, the teacher clicks 'Presentation Mode' to project ultra-clear, high-contrast slides directly onto the screen."}
                {activeWorkflowTab === "classroom" &&
                  "Students experience rich interactive diagrams, real-time polling, video highlights, and structured teaching without distractions."}
              </p>
            </div>

            <div className="lg:w-1/2 w-full bg-white p-6 rounded-xl border border-slate-200 text-center shadow-2xs">
              <div className="h-48 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-4">
                <div className="w-14 h-14 rounded-2xl bg-[#006783]/10 border border-[#006783]/20 flex items-center justify-center text-[#006783] mb-3">
                  {activeWorkflowTab === "laptop" && <Laptop className="w-7 h-7" />}
                  {activeWorkflowTab === "webapp" && <Globe className="w-7 h-7" />}
                  {activeWorkflowTab === "projector" && <Projector className="w-7 h-7" />}
                  {activeWorkflowTab === "classroom" && <School className="w-7 h-7" />}
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {activeWorkflowTab === "laptop" && "Laptop Screen (Control Panel)"}
                  {activeWorkflowTab === "webapp" && "Cloud Web Engine + AI Prompt"}
                  {activeWorkflowTab === "projector" && "Classroom Display (Projector/TV)"}
                  {activeWorkflowTab === "classroom" && "Smart Interactive Student Learning"}
                </span>
                <span className="text-xs text-[#096145] font-bold mt-1">Ready for Class</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 & 5: KEY TEACHING FEATURES GRID */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#006783] mb-3">Built for Modern Educators</h2>
            <p className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
              Key Digital Teaching Features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Interactive Lessons", desc: "Rich multimedia slide decks with embedded videos, animated diagrams, and step-by-step topic breakdowns." },
              { icon: Brain, title: "AI Quiz Generator", desc: "Instantly create multiple choice, short answer, and analytical questions matching exact chapter concepts." },
              { icon: Sliders, title: "Classroom Navigation", desc: "Effortlessly jump between chapters, previous reviews, and quick recap summaries with intuitive hotkeys." },
              { icon: FileText, title: "Instant Homework Builder", desc: "Generate printable or downloadable homework worksheets formatted with school branding and answer keys." },
              { icon: Projector, title: "High-Contrast Projector Mode", desc: "Custom font sizes and clear contrast themes engineered for readability from the last bench." },
              { icon: Users, title: "Multi-Grade Support", desc: "Pre-loaded curriculum structures spanning primary, middle, and high school subjects and grade levels." },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#006783] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#006783] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: AI-POWERED TEACHING HIGHLIGHT */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white border border-slate-300 p-8 sm:p-12 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d96b43]/10 text-[#d96b43] border border-[#d96b43]/20 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Major Differentiator
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Supercharge Prep Time with <span className="text-[#096145]">AI Assistance</span>
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Reduce lesson prep from hours to seconds. Teachers can generate custom questions, instant homework, and explanatory notes directly inside their digital lesson workflow.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-[#006783]/10 text-[#006783] flex items-center justify-center">✓</div>
                    <span>Generate questions by Class, Subject & Difficulty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-[#006783]/10 text-[#006783] flex items-center justify-center">✓</div>
                    <span>Create classroom-ready homework with 1-click</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-[#006783]/10 text-[#006783] flex items-center justify-center">✓</div>
                    <span>Conversational teaching co-pilot for difficult concepts</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/ai-for-teaching"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#006783] hover:bg-[#004e63] transition-all shadow-xs"
                  >
                    <span>Explore AI for Teaching</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* AI Graphic Card */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                  <Brain className="w-5 h-5 text-[#d96b43]" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Question Generator Live Demo</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Class & Subject</span>
                      <span className="font-bold text-slate-900">Class 9 • Physics</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Topic</span>
                      <span className="font-bold text-slate-900">Newton's Laws of Motion</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-[#006783]/30 shadow-2xs">
                    <span className="text-[10px] text-[#006783] font-bold block mb-1">AI Output Generated (2 sec)</span>
                    <p className="text-slate-800 text-xs font-medium">
                      "Q1: A 10kg mass accelerates at 2m/s². What is the net force applied according to F=ma?"
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                      <span>Options: A) 5N  B) 20N  C) 12N  D) 2N</span>
                      <span className="text-[#096145] font-bold">Correct: B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 & 9: BENEFITS FOR TEACHERS & SCHOOLS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#006783] mb-3">Proven Impact</h2>
            <p className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
              Benefits for Teachers & School Leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#006783]/10 text-[#006783] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">For Teachers</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#096145] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Save 5+ Hours Weekly</h4>
                    <p className="text-slate-600 text-xs mt-1">Eliminate manual question writing and formatting with AI automation tools.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#096145] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Engage Last-Bench Students</h4>
                    <p className="text-slate-600 text-xs mt-1">Vibrant visual slides keep students focused during complex science and math topics.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#d96b43]/10 text-[#d96b43] flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">For School Principals & Admin</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#d96b43] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Standardized Teaching Quality</h4>
                    <p className="text-slate-600 text-xs mt-1">Ensure consistent curriculum delivery across all sections and grade levels.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#d96b43] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">High ROI on Existing Hardware</h4>
                    <p className="text-slate-600 text-xs mt-1">Maximize your existing projectors and TVs without buying new expensive hardware.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 11: FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-2">Everything you need to know about implementing EduClass in your school.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-[#006783]"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#006783] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 12: FINAL CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white p-10 sm:p-16 rounded-3xl text-center border border-slate-300 shadow-xl">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
                Ready to Upgrade Your Classrooms?
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Book a live 20-minute online demo with our education specialists and see how EduClass empowers teachers and students alike.
              </p>
              <div className="pt-4 flex justify-center">
                <Link
                  href="/book-a-demo"
                  className="px-9 py-4 rounded-xl font-bold text-base text-white bg-[#006783] hover:bg-[#004e63] shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Book a Demo Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>);
}

