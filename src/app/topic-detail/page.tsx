"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "@/store/useChatStore";
import {
  GraduationCap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Sparkles,
  BookOpen,
  ZoomIn,
  CheckCircle2,
  X,
  RotateCcw
} from "lucide-react";

interface SlideRecord {
  id: number;
  created_at?: string;
  image: string;
  video: string;
  slide_no: number;
  topic_id: number;
}

interface PresentationRecord {
  id: number;
  created_at?: string;
  topic_name: string;
  topic_category?: string;
  link?: string;
  topic_id: number;
  tags?: string[];
}

function FormatMessageText({ text }: { text: string }) {
  if (!text) return null;

  // Clean raw LaTeX equations into clean text representation if present
  let cleanText = text
    .replace(/\\boxed\{([^}]*)\}/g, "📦 $1")
    .replace(/\\longrightarrow/g, " ➔ ")
    .replace(/\\longrightarrow/g, " ➔ ")
    .replace(/\\rightarrow/g, " ➔ ")
    .replace(/\\leftarrow/g, " ⬅ ")
    .replace(/\\underbrace\{([^}]*)\}_\{([^}]*)\}/g, "$1 ($2)")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\\[|\\\]|\\\(|\\\)/g, "")
    .replace(/\\;/g, " ")
    .replace(/\\_/g, "_");

  return (
    <div className="prose prose-slate max-w-none text-xs sm:text-sm font-normal leading-relaxed text-slate-800 space-y-2.5 break-words [&_h1]:text-base [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:my-0.5 [&_strong]:font-bold [&_strong]:text-slate-900 [&_table]:w-full [&_table]:my-3 [&_table]:border-collapse [&_table]:text-left [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100/90 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-200 [&_td]:p-2.5 [&_td]:text-xs [&_td]:bg-white overflow-x-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanText}</ReactMarkdown>
    </div>
  );
}

function TopicContent() {
  const searchParams = useSearchParams();
  const urlTopicId = searchParams.get("topic_id");
  const topicQuery = searchParams.get("query") || "Mathematics - Fractions & Decimals";
  const urlSchoolName = searchParams.get("school") || searchParams.get("schoolName");

  const { data: session } = useSession();
  const [schoolName, setSchoolName] = useState<string>(urlSchoolName || "Green Valley High School");

  // Supabase fetched states
  const [pptData, setPptData] = useState<PresentationRecord | null>(null);
  const [dbSlides, setDbSlides] = useState<SlideRecord[]>([]);
  const [isLoadingPpt, setIsLoadingPpt] = useState(true);

  useEffect(() => {
    if (urlSchoolName) {
      setSchoolName(urlSchoolName);
      return;
    }

    if (session?.user?.school_name) {
      setSchoolName(session.user.school_name);
      return;
    }

    if (typeof window !== "undefined") {
      const savedSchool = localStorage.getItem("schoolName") || localStorage.getItem("school_name");
      if (savedSchool) {
        setSchoolName(savedSchool);
      }
    }

    const fetchSchoolFromDb = async () => {
      if (session?.user?.school_id) {
        try {
          const { data: school } = await supabase
            .from("schools")
            .select("school_name")
            .eq("school_id", session.user.school_id)
            .single();

          if (school?.school_name) {
            setSchoolName(school.school_name);
            if (typeof window !== "undefined") {
              localStorage.setItem("schoolName", school.school_name);
            }
          }
        } catch (err) {
          console.error("Error loading school details:", err);
        }
      }
    };

    fetchSchoolFromDb();
  }, [session?.user?.school_id, urlSchoolName]);

  // Fetch Presentation data and associated slides from Supabase
  useEffect(() => {
    let isCancelled = false;

    const fetchPptAndSlides = async () => {
      setIsLoadingPpt(true);
      try {
        let matchedPpt: PresentationRecord | null = null;

        if (urlTopicId) {
          const numId = Number(urlTopicId);
          // Try matching by topic_id first
          const { data, error } = await supabase
            .from("presentation")
            .select("*")
            .eq("topic_id", numId)
            .maybeSingle();

          if (!error && data) {
            matchedPpt = data;
          }
        }

        // If not found by topic_id or id, search tags array, topic_name or topic_category in presentation table
        if (!matchedPpt && topicQuery) {
          const q = topicQuery.trim().toLowerCase();
          const { data: allPpts, error } = await supabase.from("presentation").select("*");

          if (!error && allPpts) {
            const found = allPpts.find((p: PresentationRecord) => {
              const nameStr = (p.topic_name || "").toLowerCase();
              const catStr = (p.topic_category || "").toLowerCase();
              if (nameStr.includes(q) || catStr.includes(q)) return true;

              if (p.tags) {
                if (Array.isArray(p.tags)) {
                  return p.tags.some((tag) => typeof tag === "string" && (tag.toLowerCase().includes(q) || q.includes(tag.toLowerCase())));
                } else if (typeof p.tags === "string") {
                  return (p.tags as string).toLowerCase().includes(q);
                }
              }

              const words = q.split(/\s+/).filter(Boolean);
              if (words.length > 0) {
                return words.every((w) => nameStr.includes(w) || catStr.includes(w) || (Array.isArray(p.tags) && p.tags.some((t) => typeof t === "string" && t.toLowerCase().includes(w))));
              }

              return false;
            });
            if (found) matchedPpt = found;
          }
        }

        if (isCancelled) return;

        if (matchedPpt) {
          console.log("Matched Presentation from Supabase:", matchedPpt);
          setPptData(matchedPpt);

          const targetTopicId = matchedPpt.topic_id ? String(matchedPpt.topic_id) : String(matchedPpt.id);

          // Query slides table filtered strictly by targetTopicId
          const { data: slidesData, error: slidesErr } = await supabase
            .from("slides")
            .select("*")
            .eq("topic_id", Number(targetTopicId));

          if (isCancelled) return;

          console.log("Supabase slides table query response -> Data:", slidesData, "Error:", slidesErr);

          let matchedSlides: SlideRecord[] = [];

          if (slidesData && slidesData.length > 0) {
            matchedSlides = [...slidesData];
            // Sort slides by slide_no
            matchedSlides.sort((a, b) => (Number(a.slide_no) || 0) - (Number(b.slide_no) || 0));
          }

          console.log("Final matchedSlides set:", matchedSlides);
          setDbSlides(matchedSlides);
        } else {
          console.log("No matching Presentation found in Supabase for query:", topicQuery);
          setPptData(null);
          setDbSlides([]);
        }
      } catch (err) {
        console.error("Error fetching Presentation and slides from Supabase:", err);
      } finally {
        if (!isCancelled) setIsLoadingPpt(false);
      }
    };

    fetchPptAndSlides();

    return () => {
      isCancelled = true;
    };
  }, [urlTopicId, topicQuery]);

  // State for single-page presentation viewer
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [pdfNumPages, setPdfNumPages] = useState<number | null>(null);
  const [pdfThumbnails, setPdfThumbnails] = useState<Record<number, string>>({});
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // Canvas Refs for 100% Native Page Rendering (NO iframe, NO browser PDF viewer)
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<any>(null);

  // Total slides determined from PDF document pages or slide table rows
  const maxDbSlideNo = dbSlides.length > 0 ? Math.max(...dbSlides.map((s) => Number(s.slide_no) || 0), dbSlides.length) : 0;
  const totalSlides = pdfNumPages && pdfNumPages > 0 ? pdfNumPages : (maxDbSlideNo > 0 ? maxDbSlideNo : 3);

  // Consolidated list of all slides from 1 to totalSlides
  const allSlidesList = Array.from({ length: totalSlides }, (_, i) => {
    const slideNo = i + 1;
    const matched = dbSlides.find((s) => Number(s.slide_no) === slideNo);
    return {
      id: matched?.id || slideNo,
      slide_no: slideNo,
      image: matched?.image || pdfThumbnails[slideNo] || "",
      video: matched?.video || "",
      topic_id: matched?.topic_id || 0,
    };
  });

  // Reset to slide 1 whenever presentation changes
  useEffect(() => {
    setCurrentSlideIndex(1);
    setPdfNumPages(null);
    setPdfThumbnails({});
    pdfDocRef.current = null;
  }, [pptData?.id]);

  // Modals state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPptFullscreenOpen, setIsPptFullscreenOpen] = useState(false);
  const [isMcqModalOpen, setIsMcqModalOpen] = useState(false);
  const [isAskAnythingModalOpen, setIsAskAnythingModalOpen] = useState(false);

  // AI MCQ Generator States
  const [mcqStep, setMcqStep] = useState<"select-count" | "loading" | "quiz">("select-count");
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(5);
  const [generatedMcqs, setGeneratedMcqs] = useState<Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>>([]);
  const [currentMcqIndex, setCurrentMcqIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isGeneratingMcq, setIsGeneratingMcq] = useState<boolean>(false);
  const [mcqError, setMcqError] = useState<string | null>(null);

  // Function to trigger AI generation with selected topic & category
  const handleGenerateMcqs = async (count: number) => {
    setSelectedQuestionCount(count);
    setMcqStep("loading");
    setIsGeneratingMcq(true);
    setMcqError(null);
    setUserAnswers({});
    setCurrentMcqIndex(0);

    const topicName = pptData?.topic_name || topicQuery || "Mathematics - Fractions & Decimals";
    const categoryName = pptData?.topic_category || "General Education";

    try {
      const response = await fetch("/api/generate-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicName,
          category: categoryName,
          count: count,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setGeneratedMcqs(data.questions);
        setMcqStep("quiz");
      } else {
        setMcqError(data.error || "Failed to generate questions. Please try again.");
        setMcqStep("select-count");
      }
    } catch (err: any) {
      console.error("Error generating MCQs:", err);
      setMcqError("Network error. Please try again.");
      setMcqStep("select-count");
    } finally {
      setIsGeneratingMcq(false);
    }
  };

  const handleOpenMcqModal = () => {
    setMcqStep("select-count");
    setMcqError(null);
    setIsMcqModalOpen(true);
  };

  // Load PDF Document via PDF.js in Browser
  useEffect(() => {
    let isCancelled = false;

    const loadPdfDoc = async () => {
      if (!pptData?.link) return;

      setIsLoadingPdf(true);
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js" as any);
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

        let doc: any = null;
        try {
          const res = await fetch(pptData.link);
          if (res.ok) {
            const buffer = await res.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
            doc = await loadingTask.promise;
          }
        } catch (fetchErr) {
          console.warn("ArrayBuffer fetch failed, falling back to direct URL loading:", fetchErr);
        }

        if (!doc) {
          const loadingTask = pdfjsLib.getDocument(pptData.link);
          doc = await loadingTask.promise;
        }

        if (isCancelled) return;

        console.log("PDF successfully loaded with total pages:", doc.numPages);
        pdfDocRef.current = doc;
        setPdfNumPages(doc.numPages);

        // Generate high-resolution slide image data URLs for each page (scale 1.5)
        const newThumbnails: Record<number, string> = {};
        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          try {
            const page = await doc.getPage(pageNum);
            const vp = page.getViewport({ scale: 1.5 });
            const thumbCanvas = document.createElement("canvas");
            thumbCanvas.width = vp.width;
            thumbCanvas.height = vp.height;
            const ctx = thumbCanvas.getContext("2d");
            if (ctx) {
              await page.render({ canvasContext: ctx, viewport: vp }).promise;
              newThumbnails[pageNum] = thumbCanvas.toDataURL("image/png");
            }
          } catch (tErr) {
            console.warn(`Failed to render page image for slide ${pageNum}`, tErr);
          }
        }

        if (!isCancelled) {
          setPdfThumbnails(newThumbnails);
        }
      } catch (err) {
        console.error("PDF.js loading error:", err);
      } finally {
        if (!isCancelled) setIsLoadingPdf(false);
      }
    };

    loadPdfDoc();

    return () => {
      isCancelled = true;
    };
  }, [pptData?.link]);

  // Render active slide page (currentSlideIndex) onto main canvas and modal canvas
  useEffect(() => {
    let isCancelled = false;

    const renderActivePage = async () => {
      if (!pdfDocRef.current) return;

      try {
        const page = await pdfDocRef.current.getPage(currentSlideIndex);
        if (isCancelled) return;

        // Render main canvas
        if (mainCanvasRef.current) {
          const containerWidth = stageContainerRef.current?.clientWidth || 600;
          const containerHeight = stageContainerRef.current?.clientHeight || 380;

          const unscaledViewport = page.getViewport({ scale: 1.0 });
          const scaleX = (containerWidth - 16) / unscaledViewport.width;
          const scaleY = (containerHeight - 16) / unscaledViewport.height;
          const fitScale = Math.max(0.5, Math.min(scaleX, scaleY));

          const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
          const viewport = page.getViewport({ scale: fitScale * dpr });
          const canvas = mainCanvasRef.current;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${viewport.width / dpr}px`;
          canvas.style.height = `${viewport.height / dpr}px`;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport }).promise;
          }
        }

        // Render fullscreen modal canvas if open
        if (isPptFullscreenOpen && fullscreenCanvasRef.current) {
          const unscaledViewport = page.getViewport({ scale: 1.0 });
          const maxW = (typeof window !== "undefined" ? window.innerWidth : 1200) * 0.9;
          const maxH = (typeof window !== "undefined" ? window.innerHeight : 800) * 0.82;
          const scaleX = maxW / unscaledViewport.width;
          const scaleY = maxH / unscaledViewport.height;
          const fitScale = Math.min(scaleX, scaleY);

          const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
          const viewport = page.getViewport({ scale: fitScale * dpr });
          const canvas = fullscreenCanvasRef.current;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${viewport.width / dpr}px`;
          canvas.style.height = `${viewport.height / dpr}px`;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport }).promise;
          }
        }
      } catch (err) {
        console.error(`Error rendering page ${currentSlideIndex}:`, err);
      }
    };

    renderActivePage();

    return () => {
      isCancelled = true;
    };
  }, [currentSlideIndex, pptData, isPptFullscreenOpen, isLoadingPdf, pdfNumPages]);

  // Diagram record from 'slides' table strictly matching slide_no === currentSlideIndex
  const matchedDiagramSlide = dbSlides.find(
    (s) => Number(s.slide_no) === currentSlideIndex
  );

  // Active diagram image strictly from 'slides' table or PDF thumbnail fallback
  const currentDiagramImage = matchedDiagramSlide?.image || pdfThumbnails[currentSlideIndex] || "";
  const currentVideoUrl = matchedDiagramSlide?.video || "";

  // Helper object for modal popups and video lesson references
  const currentSlide = {
    slideNumber: currentSlideIndex,
    title: `${pptData?.topic_name || topicQuery} - Slide ${currentSlideIndex}`,
    pptImage: matchedDiagramSlide?.image || "",
    leftDiagram: {
      image: currentDiagramImage,
      title: `Diagram - Slide ${currentSlideIndex}`,
    },
    rightVideo: {
      thumbnail: currentDiagramImage,
      title: `Video Lesson ${currentSlideIndex}`,
      videoUrl: currentVideoUrl,
      duration: currentVideoUrl ? "Video" : "--:--",
      timestamps: [] as Array<{ time: string; label: string }>,
    },
  };

  // Zustand Chat Store for Ask Anything Modal
  const { chatMessages, setChatMessages, activeTopicKey, setActiveTopicKey, clearChatStore } = useChatStore();
  const [inputMessage, setInputMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Initialize or restore chat for current topic (retains chat on page refresh)
  useEffect(() => {
    if (isLoadingPpt) return;

    const topicName = pptData?.topic_name || topicQuery || "Mathematics - Fractions & Decimals";
    const categoryName = pptData?.topic_category || "General Education";
    const currentTopicKey = `${urlTopicId || ""}_${topicName}`;

    // If switching to a new topic (or opening for first time), reset store for new topic
    if (activeTopicKey !== currentTopicKey) {
      setActiveTopicKey(currentTopicKey);
      setChatMessages([
        {
          sender: "ai",
          text: `Hello! I am your AI Tutor for "${topicName}" (${categoryName}). Ask me any question related to this topic!`,
        },
      ]);
    }
  }, [isLoadingPpt, pptData?.topic_name, pptData?.topic_category, topicQuery, urlTopicId, activeTopicKey, setActiveTopicKey, setChatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSendingChat) return;
    const userMsg = inputMessage.trim();
    const updatedHistory = [...chatMessages, { sender: "user" as const, text: userMsg }];
    setChatMessages(updatedHistory);
    setInputMessage("");
    setIsSendingChat(true);

    const topicName = pptData?.topic_name || topicQuery || "Mathematics - Fractions & Decimals";
    const categoryName = pptData?.topic_category || "General Education";

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicName,
          category: categoryName,
          message: userMsg,
          chatHistory: updatedHistory,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: `I am here to help you with ${topicName}. Please ask your question again!` },
        ]);
      }
    } catch (err) {
      console.error("Chat assistant error:", err);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Sorry, I encountered an error connecting. Please try asking again!` },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCloseAskAnythingModal = () => {
    setIsAskAnythingModalOpen(false);
  };

  // Video Playing State inside modal
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(true);

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 1) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-200">
      {/* Top Header */}
      <header className="relative bg-white border-b border-slate-200 h-[64px] px-4 md:px-6 shrink-0 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-3 z-10">
          <Link
            href="/dashboard"
            onClick={() => clearChatStore()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>

        {/* Center Header: Topic Name */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#006783] flex items-center justify-center text-white shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight capitalize">
              {isLoadingPpt ? (
                <span className="animate-pulse text-slate-400">Loading topic...</span>
              ) : (
                pptData?.topic_name || topicQuery
              )}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-2 sm:p-3 md:p-4 flex flex-col gap-3">
        {/* 3-Column Synchronized Layout: Left (Diagram 2 cols) | Center (PPT 8 cols - DOMINANT) | Right (Video 2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">

          {/* LEFT COLUMN: Synchronized Image & Reference Diagrams List (lg:col-span-2 - Small & Compact) */}
          <section className="lg:col-span-2 flex flex-col justify-between gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-col gap-2.5 transition-all flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    Diagrams ({dbSlides.length > 0 ? dbSlides.length : totalSlides})
                  </h3>
                </div>
                <button
                  onClick={() => currentDiagramImage && setIsImageModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  title="Expand active diagram image"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Compact List of Diagram Images strictly from 'slides' DB table */}
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[520px] p-1 scrollbar-thin">
                {(dbSlides.length > 0 ? dbSlides : allSlidesList).map((slideRec) => {
                  const slideNo = Number(slideRec.slide_no);
                  const isCurrent = slideNo === currentSlideIndex;
                  const slideImg = slideRec.image;

                  return (
                    <div
                      key={slideRec.id || slideNo}
                      onClick={() => {
                        setCurrentSlideIndex(slideNo);
                        if (slideImg) {
                          setIsImageModalOpen(true);
                        }
                      }}
                      className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer bg-slate-900 flex flex-col items-center justify-center ${isCurrent
                        ? "border-[#006783] ring-2 ring-[#006783]/40 scale-[1.02] shadow-md z-10 grayscale-0 blur-none brightness-100 opacity-100"
                        : "border-slate-200 grayscale blur-[1.5px] brightness-75 opacity-50 hover:grayscale-0 hover:blur-none hover:brightness-100 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                      title={`Open Slide ${slideNo} Diagram in Big View`}
                    >
                      {slideImg ? (
                        <>
                          <Image
                            src={slideImg}
                            alt={`Diagram Slide ${slideNo}`}
                            fill
                            priority
                            loading="eager"
                            sizes="(max-width: 768px) 100vw, 20vw"
                            className="object-cover"
                          />
                          <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                            Slide {slideNo}
                          </span>
                        </>
                      ) : (
                        <div className="p-2 text-center text-slate-400 text-[10px] font-medium bg-slate-50 w-full h-full flex flex-col items-center justify-center gap-0.5">
                          <BookOpen className="w-5 h-5 text-slate-300" />
                          <span>Slide {slideNo}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generate MCQ Button outside Image Card */}
            <button
              onClick={handleOpenMcqModal}
              className="w-full mt-1 py-2.5 px-3 bg-[#006783] hover:bg-[#004e63] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Test your knowledge</span>
            </button>
          </section>

          {/* CENTER COLUMN: Classroom PPT Presentation Deck (lg:col-span-8 - DOMINANT MAIN TEACHING AREA) */}
          <section className="lg:col-span-8 flex flex-col justify-between gap-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-col justify-between h-full">

              {/* Minimal Top Header: Slide Counter */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {totalSlides > 0 ? `Slide ${currentSlideIndex} of ${totalSlides}` : "No Slides"}
                </div>
              </div>

              {/* Main PPT Slide Stage: Maximized Height & Width Fit */}
              <div className="w-full flex-1 flex items-center justify-center my-1 relative bg-white min-h-[460px] overflow-hidden">
                <div
                  ref={stageContainerRef}
                  className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden"
                >
                  {isLoadingPdf ? (
                    <div className="text-slate-500 text-xs font-semibold flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-[#006783] border-t-transparent animate-spin" />
                      Rendering slide {currentSlideIndex}...
                    </div>
                  ) : pptData?.link ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white">
                      {pdfThumbnails[currentSlideIndex] ? (
                        <img
                          src={pdfThumbnails[currentSlideIndex]}
                          alt={`Slide ${currentSlideIndex}`}
                          className="w-full h-full object-contain bg-white"
                        />
                      ) : (
                        <canvas
                          ref={mainCanvasRef}
                          className="w-full h-full object-contain bg-white"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-sm font-semibold bg-white w-full h-full flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl">
                      <GraduationCap className="w-10 h-10 text-slate-300" />
                      <span>No Presentation Link Available in Database</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Navigation Controls Bar: Previous and Next */}
              <div className="flex items-center justify-center pt-2 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handlePrevSlide}
                    disabled={currentSlideIndex === 1}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${currentSlideIndex === 1
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
                      : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer hover:shadow-md"
                      }`}
                    title="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex === totalSlides}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${currentSlideIndex === totalSlides
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
                      : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer hover:shadow-md"
                      }`}
                    title="Next slide"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Synchronized Video Lessons List (lg:col-span-2 - Small & Compact) */}
          <section className="lg:col-span-2 flex flex-col justify-between gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-col gap-2.5 transition-all flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-[#d96b43]" />
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    Videos ({dbSlides.length > 0 ? dbSlides.length : totalSlides})
                  </h3>
                </div>
              </div>

              {/* Compact Vertical List of Slide Videos strictly from 'slides' DB table */}
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[520px] p-1 scrollbar-thin">
                {(dbSlides.length > 0 ? dbSlides : allSlidesList).map((slideRec) => {
                  const slideNo = Number(slideRec.slide_no);
                  const isCurrent = slideNo === currentSlideIndex;
                  const slideImg = slideRec.image;
                  const slideVid = slideRec.video;

                  return (
                    <div
                      key={slideRec.id || slideNo}
                      onClick={() => {
                        setCurrentSlideIndex(slideNo);
                        setIsVideoModalOpen(true);
                      }}
                      className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer bg-slate-950 flex items-center justify-center ${isCurrent
                        ? "border-[#d96b43] ring-2 ring-[#d96b43]/40 scale-[1.02] shadow-md z-10 grayscale-0 blur-none brightness-100 opacity-100"
                        : "border-slate-200 grayscale blur-[1.5px] brightness-75 opacity-50 hover:grayscale-0 hover:blur-none hover:brightness-100 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                      title={`Play Video Lesson ${slideNo}`}
                    >
                      {slideVid ? (
                        slideVid.includes("youtube.com") || slideVid.includes("youtu.be") ? (
                          <img
                            src={
                              slideVid.includes("v=")
                                ? `https://img.youtube.com/vi/${slideVid.split("v=")[1]?.split("&")[0]}/mqdefault.jpg`
                                : `https://img.youtube.com/vi/${slideVid.split("/").pop()}/mqdefault.jpg`
                            }
                            alt={`Video Thumbnail ${slideNo}`}
                            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <video
                            src={slideVid}
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-85"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-2 text-slate-400">
                          <Play className="w-5 h-5 text-slate-500 mb-1" />
                          <span className="text-[10px] font-bold">Video {slideNo}</span>
                        </div>
                      )}

                      {/* Floating Play Button Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full bg-[#d96b43] text-white flex items-center justify-center shadow-lg transition-transform ${isCurrent ? "scale-105" : "scale-90"}`}>
                          <Play className="w-4 h-4 ml-0.5 fill-white" />
                        </div>
                      </div>

                      <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                        Lesson {slideNo}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ask Anything Button outside Video Card */}
            <button
              onClick={() => setIsAskAnythingModalOpen(true)}
              className="w-full mt-1 py-2.5 px-3 bg-[#d96b43] hover:bg-[#c05932] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Ask Anything</span>
            </button>
          </section>

        </div>
      </main>


      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {currentSlide.leftDiagram.title}
                  </h3>
                  <p className="text-xs text-slate-500">Reference Diagram for Slide {currentSlideIndex}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsImageModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="relative w-full h-[78vh] bg-slate-950 p-4 flex items-center justify-center">
                {currentSlide?.leftDiagram?.image ? (
                  <Image
                    src={currentSlide.leftDiagram.image}
                    alt={currentSlide.leftDiagram.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 90vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-sm font-medium">No diagram image available</div>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="text-xs text-slate-600 font-medium">
                  High resolution diagram viewer
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => alert("Downloading diagram image...")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006783] text-white hover:bg-[#004e63] font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Diagram
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Interactive Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-slate-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col border border-slate-800 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Header */}
              <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d96b43] flex items-center justify-center text-white font-bold">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg">
                      {currentSlide.rightVideo.title}
                    </h3>
                    <p className="text-xs text-slate-400">Video Lesson for Slide {currentSlideIndex}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer"
                  title="Close video modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Main Interactive Video Screen */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center group overflow-hidden">
                {currentSlide?.rightVideo?.videoUrl ? (
                  currentSlide.rightVideo.videoUrl.includes("youtube.com") || currentSlide.rightVideo.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={
                        currentSlide.rightVideo.videoUrl.includes("v=")
                          ? `https://www.youtube.com/embed/${currentSlide.rightVideo.videoUrl.split("v=")[1]?.split("&")[0]}?autoplay=1`
                          : `https://www.youtube.com/embed/${currentSlide.rightVideo.videoUrl.split("/").pop()}?autoplay=1`
                      }
                      className="w-full h-full border-none"
                      title={currentSlide.rightVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={currentSlide.rightVideo.videoUrl}
                      poster={currentSlide.rightVideo.thumbnail || undefined}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <>
                    <Image
                      src={currentSlide.rightVideo.thumbnail || "/file.svg"}
                      alt={currentSlide.rightVideo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-cover opacity-90"
                    />
                    <div className="relative z-10 p-6 text-center bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 text-slate-300 max-w-md">
                      <Play className="w-12 h-12 text-[#d96b43] mx-auto mb-2" />
                      <p className="font-bold text-sm text-white">No video media linked for Slide {currentSlideIndex}</p>
                      <p className="text-xs text-slate-400 mt-1">Video files linked in the Supabase `slide` table will play directly inside this player.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Video Chapters Footer inside Modal */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Chapter Timestamps:</span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {currentSlide.rightVideo.timestamps.map((ts, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold shrink-0"
                    >
                      {ts.time} {ts.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Fullscreen PPT Slide Presentation Modal */}
      <AnimatePresence>
        {isPptFullscreenOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col"
          >
            {/* Fullscreen PPT Header */}
            <div className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[#d96b43] font-extrabold text-lg">✳</span>
                <span className="font-bold text-white text-base sm:text-lg">
                  {currentSlide.title}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">
                  Slide {currentSlideIndex} / {totalSlides}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPptFullscreenOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Exit Fullscreen (Esc)
                </motion.button>
              </div>
            </div>

            {/* Fullscreen Slide Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              {pptData?.link ? (
                <div className="w-full h-full max-w-[98vw] max-h-[90vh] flex items-center justify-center overflow-hidden">
                  {pdfThumbnails[currentSlideIndex] ? (
                    <img
                      src={pdfThumbnails[currentSlideIndex]}
                      alt={`Fullscreen Slide ${currentSlideIndex}`}
                      className="w-full h-full object-contain shadow-2xl rounded-lg bg-white"
                    />
                  ) : (
                    <canvas
                      ref={fullscreenCanvasRef}
                      className="w-full h-full object-contain shadow-2xl rounded-lg bg-white"
                    />
                  )}
                </div>
              ) : (
                <div className="text-slate-400 text-sm font-medium">No slide presentation available</div>
              )}

              {/* Prev / Next Floating Navigation Controls */}
              <motion.button
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevSlide}
                className="absolute left-6 p-4 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-all border border-white/10 cursor-pointer shadow-2xl"
                title="Previous slide"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextSlide}
                className="absolute right-6 p-4 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-all border border-white/10 cursor-pointer shadow-2xl"
                title="Next slide"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
            </div>

            {/* Fullscreen PPT Bottom Bar */}
            <div className="h-16 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
              <span>Green Valley High School | Digital Classroom PPT</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNextSlide}
                  className="px-3 py-1.5 rounded-lg bg-[#006783] hover:bg-[#004e63] text-white font-bold"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 4: AI MCQ Generator Modal */}
      <AnimatePresence>
        {isMcqModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsMcqModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#006783] flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      Test Your Knowledge
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">AI Powered</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Topic: <span className="text-slate-800 font-bold">{pptData?.topic_name || topicQuery}</span>
                      {pptData?.topic_category && <> • Category: <span className="text-[#006783] font-bold">{pptData.topic_category}</span></>}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMcqModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* STEP 1: Select Number of Questions (1-10 Boxes) */}
              {mcqStep === "select-count" && (
                <div className="flex flex-col gap-4 py-2">
                  {mcqError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                      {mcqError}
                    </div>
                  )}

                  <div className="text-center sm:text-left">
                    <h4 className="font-extrabold text-slate-800 text-base">Select Number of Questions</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose how many questions you want AI to generate for this topic (1 to 10):
                    </p>
                  </div>

                  {/* 1 to 10 Box Grid */}
                  <div className="grid grid-cols-5 gap-3 my-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.06, translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGenerateMcqs(num)}
                        className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                          selectedQuestionCount === num
                            ? "bg-[#006783] border-[#006783] text-white shadow-md"
                            : "bg-white hover:bg-sky-50/70 border-slate-200 hover:border-[#006783] text-slate-800"
                        }`}
                      >
                        <span className="text-2xl font-black">{num}</span>
                        <span className={`text-[10px] font-bold tracking-tight uppercase mt-0.5 ${
                          selectedQuestionCount === num ? "text-amber-300" : "text-slate-400 group-hover:text-[#006783]"
                        }`}>
                          {num === 1 ? "Question" : "Questions"}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <p className="text-[11px] text-center text-slate-400">
                    💡 Clicking a box sends topic & category details to AI to generate exact question count.
                  </p>
                </div>
              )}

              {/* STEP 2: Loading State */}
              {mcqStep === "loading" && (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center relative">
                    <span className="w-10 h-10 rounded-full border-3 border-[#006783] border-t-transparent animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-500 absolute" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Generating {selectedQuestionCount} Questions with AI...</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Analyzing <span className="font-bold text-slate-700">{pptData?.topic_name || topicQuery}</span> ({pptData?.topic_category || "General Education"})
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: Quiz View */}
              {mcqStep === "quiz" && generatedMcqs.length > 0 && (
                <div className="flex flex-col gap-4">
                  {/* Quiz Header Info */}
                  <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">
                      Question {currentMcqIndex + 1} of {generatedMcqs.length}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#006783] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                        Score: {Object.entries(userAnswers).filter(([idx, ans]) => generatedMcqs[Number(idx)]?.correctAnswer === ans).length} / {generatedMcqs.length}
                      </span>
                      <button
                        onClick={() => setMcqStep("select-count")}
                        className="text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                      >
                        Change Count
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#006783] h-full transition-all duration-300"
                      style={{ width: `${((currentMcqIndex + 1) / generatedMcqs.length) * 100}%` }}
                    />
                  </div>

                  {/* Active Question Box */}
                  {(() => {
                    const currentQ = generatedMcqs[currentMcqIndex];
                    const selectedOption = userAnswers[currentMcqIndex];
                    const isAnswered = selectedOption !== undefined;

                    return (
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-slate-900 text-base leading-snug">
                          {currentQ.id}. {currentQ.question}
                        </h4>

                        {/* Options */}
                        <div className="flex flex-col gap-2.5 mt-1">
                          {currentQ.options.map((option, optIdx) => {
                            const isSelected = selectedOption === optIdx;
                            const isCorrect = currentQ.correctAnswer === optIdx;

                            let btnStyle = "bg-white border-slate-200 hover:border-[#006783] hover:bg-sky-50/50 text-slate-800";
                            if (isAnswered) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-red-50 border-red-500 text-red-900 font-bold shadow-xs";
                              } else {
                                btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                              }
                            }

                            return (
                              <motion.button
                                key={optIdx}
                                whileHover={!isAnswered ? { scale: 1.01, x: 2 } : {}}
                                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                                onClick={() => {
                                  if (!isAnswered) {
                                    setUserAnswers({ ...userAnswers, [currentMcqIndex]: optIdx });
                                  }
                                }}
                                disabled={isAnswered}
                                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span className="text-sm font-medium">
                                  <strong className="mr-2 text-slate-400 font-bold">{String.fromCharCode(65 + optIdx)}.</strong>
                                  {option}
                                </span>

                                {isAnswered && isCorrect && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                )}
                                {isAnswered && isSelected && !isCorrect && (
                                  <X className="w-5 h-5 text-red-600 shrink-0" />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {isAnswered && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                              selectedOption === currentQ.correctAnswer
                                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                                : "bg-amber-50/80 border-amber-200 text-amber-900"
                            }`}
                          >
                            <span className="font-bold block mb-0.5">
                              {selectedOption === currentQ.correctAnswer ? "✓ Correct Answer!" : "ℹ Explanation:"}
                            </span>
                            {currentQ.explanation}
                          </motion.div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Footer Navigation */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentMcqIndex((prev) => Math.max(prev - 1, 0))}
                      disabled={currentMcqIndex === 0}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={() => {
                        if (currentMcqIndex < generatedMcqs.length - 1) {
                          setCurrentMcqIndex((prev) => prev + 1);
                        } else {
                          setMcqStep("select-count");
                        }
                      }}
                      className="px-4 py-2 bg-[#006783] hover:bg-[#004e63] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {currentMcqIndex < generatedMcqs.length - 1 ? (
                        <>Next Question →</>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" /> Start New Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 5: Ask Anything AI Chat Assistant Modal */}
      <AnimatePresence>
        {isAskAnythingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={handleCloseAskAnythingModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-4xl lg:max-w-5xl w-full h-[680px] max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#d96b43] flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">Ask Anything (AI Assistant)</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Topic: <span className="text-slate-800 font-bold">{pptData?.topic_name || topicQuery}</span>
                      {pptData?.topic_category && <> • Category: <span className="text-[#d96b43] font-bold">{pptData.topic_category}</span></>}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseAskAnythingModal}
                  className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Chat Log */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
                <AnimatePresence>
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${msg.sender === "user" ? "ml-auto flex-row-reverse max-w-[85%]" : "w-full max-w-[94%]"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.sender === "user" ? "bg-slate-800 text-white" : "bg-[#d96b43] text-white"
                          }`}
                      >
                        {msg.sender === "user" ? "You" : "AI"}
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${msg.sender === "user"
                          ? "bg-[#006783] text-white rounded-tr-none shadow-xs"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
                          }`}
                      >
                        {msg.sender === "user" ? (
                          <div className="text-white font-semibold whitespace-pre-wrap">{msg.text}</div>
                        ) : (
                          <FormatMessageText text={msg.text} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isSendingChat && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5 max-w-[85%]"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#d96b43] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        AI
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border-2 border-[#d96b43] border-t-transparent animate-spin" />
                        AI is analyzing your question for {pptData?.topic_name || topicQuery}...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ask anything about ${pptData?.topic_name || topicQuery}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isSendingChat && handleSendMessage()}
                  disabled={isSendingChat}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none focus:border-[#d96b43] focus:bg-white text-slate-900 transition-all disabled:opacity-60"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSendMessage}
                  disabled={isSendingChat || !inputMessage.trim()}
                  className="px-4 py-2.5 bg-[#d96b43] hover:bg-[#c05932] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingChat ? "Asking..." : "Send"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TopicDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-600 font-bold">Loading topic material...</div>}>
      <TopicContent />
    </Suspense>
  );
}

