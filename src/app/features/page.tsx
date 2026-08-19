"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Projector,
  FileQuestion,
  Sparkles,
  Laptop,
  Video,
  Layers,
  CheckCircle,
  ArrowRight,
  Monitor
} from "lucide-react";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<"digital" | "teacher" | "ai" | "delivery">("digital");

  const categories = [
    { id: "digital", title: "Digital Teaching", icon: BookOpen, desc: "Interactive lessons, media & presentation decks" },
    { id: "teacher", title: "Teacher Tools", icon: FileQuestion, desc: "Questions, assessments & homework resources" },
    { id: "ai", title: "AI Tools", icon: Brain, desc: "AI Assistant, quiz & assignment generators" },
    { id: "delivery", title: "Classroom Delivery", icon: Projector, desc: "Laptop-to-projector simple navigation" },
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#f8fafc]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="px-4 py-1.5 rounded-full bg-[#006783]/10 text-[#006783] border border-[#006783]/20 text-xs font-bold uppercase tracking-wider">
          Complete Product Capabilities
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-900 tracking-tight mt-4">
          Digital Teaching Tools Built for Modern Schools
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg">
          Explore the full suite of interactive lesson delivery, automated AI utilities, and projector-optimized classroom controls.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                isActive
                  ? "bg-white border-[#006783] shadow-md"
                  : "bg-white/60 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                isActive ? "bg-[#006783] text-white" : "bg-slate-100 text-slate-600"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.desc}</p>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: DIGITAL TEACHING */}
      {activeTab === "digital" && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold text-[#006783] uppercase tracking-widest">Interactive Content Suite</span>
                <h2 className="text-3xl font-bold text-slate-900">Digital Lessons & Visual Media</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Engage students with rich visual content tailored for every grade and topic. Eliminate plain chalkboards with high-definition diagrams, animations, and lesson slide decks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <BookOpen className="w-5 h-5 text-[#006783] mb-2" />
                    <h4 className="font-bold text-slate-900 text-sm">Digital Lessons</h4>
                    <p className="text-xs text-slate-500 mt-1">Structured chapter units aligned with national & state boards.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <Video className="w-5 h-5 text-[#d96b43] mb-2" />
                    <h4 className="font-bold text-slate-900 text-sm">Interactive Videos</h4>
                    <p className="text-xs text-slate-500 mt-1">Curated 3D science simulations and video breakdowns.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <Layers className="w-5 h-5 text-[#096145] mb-2" />
                    <h4 className="font-bold text-slate-900 text-sm">Activities</h4>
                    <p className="text-xs text-slate-500 mt-1">Live classroom polling and group problem-solving tasks.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <Monitor className="w-5 h-5 text-[#006783] mb-2" />
                    <h4 className="font-bold text-slate-900 text-sm">Presentations</h4>
                    <p className="text-xs text-slate-500 mt-1">One-click fullscreen slides designed for high legibility.</p>
                  </div>
                </div>
              </div>

              {/* Realistic Mockup */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-900">Physics — Motion & Force</span>
                    <span className="text-xs text-[#006783] bg-[#006783]/10 px-2 py-0.5 rounded border border-[#006783]/20 font-bold">Slide 6/14</span>
                  </div>
                  <div className="h-44 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 relative">
                    <div className="text-center">
                      <Video className="w-10 h-10 text-[#006783] mx-auto mb-2 animate-bounce" />
                      <span className="text-xs font-bold text-slate-800">Interactive 3D Motion Vector Simulation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TEACHER TOOLS */}
      {activeTab === "teacher" && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold text-[#d96b43] uppercase tracking-widest">Classroom Management</span>
                <h2 className="text-3xl font-bold text-slate-900">Questions, Assessments & Homework</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Equip teachers with instant questioning banks, chapter test builders, and printable homework sheets that save hours of manual prep work every single week.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <CheckCircle className="w-5 h-5 text-[#006783] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Question Repository</h4>
                      <p className="text-xs text-slate-500">Thousands of pre-indexed conceptual questions per subject.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <CheckCircle className="w-5 h-5 text-[#d96b43] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Assessment Builder</h4>
                      <p className="text-xs text-slate-500">Assemble mid-term or weekly test papers with auto-generated mark schemes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: AI TOOLS */}
      {activeTab === "ai" && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#d96b43]/30 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d96b43]/10 text-[#d96b43] text-xs font-bold border border-[#d96b43]/20">
                  <Sparkles className="w-3.5 h-3.5" /> AI Differentiator
                </span>
                <h2 className="text-3xl font-bold text-slate-900">AI-Powered Teaching Assistant</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our advanced AI model understands educational curricula. Prompt it to draft tailored questions, adapt difficulty levels, or explain difficult concepts in seconds.
                </p>
                <div>
                  <Link
                    href="/ai-for-teaching"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#006783] hover:bg-[#004e63] transition-all"
                  >
                    <span>Test AI Sandbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: CLASSROOM DELIVERY */}
      {activeTab === "delivery" && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold text-[#096145] uppercase tracking-widest">Hardware Agnostic</span>
                <h2 className="text-3xl font-bold text-slate-900">Laptop to Projector Setup</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No proprietary smartboard hardware required. Connect any standard teacher laptop to your existing classroom projectors or LCD displays with crisp high-legibility formatting.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
