import Link from "next/link";
import { GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006783] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
                EduClass <span className="text-[#006783] font-sans font-semibold text-sm">Pro</span>
              </span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              The next-generation digital classroom and AI teaching platform designed to transform everyday teaching for modern schools.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#096145]" />
              <span>Projector Ready • AI Powered • Teacher Approved</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-[#006783] transition-colors font-medium">
                  Digital Classroom
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-slate-600 hover:text-[#006783] transition-colors font-medium">
                  Interactive Features
                </Link>
              </li>
              <li>
                <Link href="/ai-for-teaching" className="text-slate-600 hover:text-[#006783] transition-colors font-medium flex items-center gap-1.5">
                  AI Teaching Tools
                  <span className="text-[10px] bg-[#d96b43] text-white px-1.5 py-0.2 rounded font-bold">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-slate-600 hover:text-[#006783] transition-colors font-medium">
                  Classroom Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">Solutions</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
              <li>Smart Classroom Tech</li>
              <li>AI Question Generator</li>
              <li>AI Assessment Builder</li>
              <li>Interactive Presentations</li>
              <li>School Administration</li>
            </ul>
          </div>

          {/* Contact / CTA */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">Get Started</h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule a personalized walkthrough for your school management team.
            </p>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#006783] hover:bg-[#004e63] text-white transition-all shadow-xs"
            >
              <span>Request School Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-medium">
          <p>© {new Date().getFullYear()} EduClass Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">School Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
