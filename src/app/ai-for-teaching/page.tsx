"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Zap,
  FileText,
  BookOpen,
  Send,
  Bot,
  User,
  RefreshCw
} from "lucide-react";

export default function AiForTeachingPage() {
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedTopic, setSelectedTopic] = useState("Cell Structure");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Array<{ id: number; question: string; options: string[]; answer: string }>>([
    {
      id: 1,
      question: "Which organelle is known as the powerhouse of the cell?",
      options: ["A) Ribosome", "B) Mitochondria", "C) Golgi Body", "D) Nucleus"],
      answer: "B) Mitochondria",
    },
    {
      id: 2,
      question: "What is the primary function of the Cell Membrane?",
      options: ["A) Protein synthesis", "B) Selective permeability & protection", "C) Storing water", "D) Photosynthesis"],
      answer: "B) Selective permeability & protection",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Teacher! How can I assist with your lesson plan today?" },
    { sender: "user", text: "Explain photosynthesis using an analogy suitable for Class 6 students." },
    {
      sender: "ai",
      text: "Think of a leaf as a solar-powered kitchen! Sunlight is the electricity, water from roots and carbon dioxide from air are raw ingredients, and glucose (food) is the delicious meal produced for the plant!",
    },
  ]);
  const [userChatInput, setUserChatInput] = useState("");

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedQuestions([
        {
          id: 1,
          question: `[${selectedClass} ${selectedSubject}] Sample Q1 for topic "${selectedTopic}" (${selectedDifficulty} difficulty): Explain key concept breakdown.`,
          options: ["Option A", "Option B (Correct)", "Option C", "Option D"],
          answer: "Option B (Correct)",
        },
        {
          id: 2,
          question: `[${selectedClass} ${selectedSubject}] Sample Q2 for topic "${selectedTopic}": Identify analytical application.`,
          options: ["Choice 1", "Choice 2", "Choice 3 (Correct)", "Choice 4"],
          answer: "Choice 3 (Correct)",
        },
      ]);
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newMsg = userChatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: newMsg }]);
    setUserChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Great question regarding "${newMsg.slice(0, 25)}..."! Here is a recommended teaching activity to demonstrate this concept in your next class!`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 bg-[#f8fafc]">
      
      {/* HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d96b43]/10 border border-[#d96b43]/20 text-[#d96b43] text-xs sm:text-sm font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Major Product Differentiator</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
          Your Intelligent <span className="text-[#006783]">AI Teaching Assistant</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          Create questions, assessments, homework sheets, and explanations in seconds. Save hours of weekly lesson prep.
        </p>
      </section>

      {/* WORKFLOW DEMO 1: AI QUESTION GENERATOR */}
      <section className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-[#d96b43] uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4" /> Interactive Workflow Demo
            </span>
            <h2 className="text-2xl font-bold text-slate-900">AI Question Generator</h2>
          </div>
          <div className="text-xs text-slate-500 font-medium">Select parameters & generate live preview</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Controls */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              >
                <option>Class 6</option>
                <option>Class 7</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              >
                <option>Science</option>
                <option>Mathematics</option>
                <option>Social Studies</option>
                <option>English Literature</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Chapter / Topic</label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {["Easy", "Medium", "Hard"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`py-1.5 rounded text-xs font-bold border cursor-pointer ${
                      selectedDifficulty === lvl
                        ? "bg-[#006783] text-white border-[#006783]"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="w-full py-3 bg-[#006783] hover:bg-[#004e63] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Questions</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Output */}
          <div className="lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-mono text-[#006783] font-bold">
                Generated Output: {selectedClass} • {selectedSubject} • {selectedTopic}
              </span>
              <span className="text-[10px] bg-[#096145]/10 text-[#096145] border border-[#096145]/20 px-2 py-0.5 rounded font-bold">
                AI Ready
              </span>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs">
                  <span className="font-bold text-slate-900">Q{q.id}. {q.question}</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1 font-medium">
                    {q.options.map((opt, idx) => (
                      <span key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">{opt}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#096145] font-bold block pt-1">Answer: {q.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONVERSATIONAL AI ASSISTANT */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006783]/10 text-[#006783] flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Conversational AI Assistant</h3>
            <p className="text-xs text-slate-500">Ask the AI co-pilot for lesson ideas, analogies, or explanations during prep time.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-h-80 overflow-y-auto">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-7 h-7 rounded-full bg-[#006783]/10 text-[#006783] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-lg leading-relaxed font-medium ${
                  msg.sender === "user"
                    ? "bg-[#006783] text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-[#006783] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Assistant e.g. 'Give me an experiment idea for sound waves...'"
            value={userChatInput}
            onChange={(e) => setUserChatInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#006783] hover:bg-[#004e63] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </section>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/book-a-demo"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-[#006783] hover:bg-[#004e63] transition-all shadow-md"
        >
          <span>See AI in Action → Book a Demo</span>
        </Link>
      </div>
    </div>
  );
}
