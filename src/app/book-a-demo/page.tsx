"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Building,
  User,
  Mail,
  Phone,
  Users,
  MessageSquare,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function BookADemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    schoolName: "",
    designation: "Principal / Trustee",
    email: "",
    phone: "",
    numberOfTeachers: "10-25 Teachers",
    numberOfStudents: "300-700",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const WHATSAPP_NUMBER = "917618181877"; // Enter your WhatsApp phone number with country code (e.g., 919876543210)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage =
      `*🎓 NEW SCHOOL DEMO REQUEST*\n\n` +
      `👤 *Full Name:* ${formData.name}\n` +
      `🏫 *School Name:* ${formData.schoolName}\n` +
      `🏷️ *Designation:* ${formData.designation}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `👥 *Teachers:* ${formData.numberOfTeachers}\n` +
      `🎒 *Students:* ${formData.numberOfStudents}\n` +
      `💬 *Message:* ${formData.message || "N/A"}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

    // Open WhatsApp with pre-filled message
    window.open(whatsappUrl, "_blank");
    setIsSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#f8fafc]">

      {/* HERO BANNER */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="px-3.5 py-1 rounded-full bg-[#006783]/10 text-[#006783] border border-[#006783]/20 text-xs font-bold uppercase tracking-wider">
          Schedule Walkthrough
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-900 tracking-tight mt-4">
          See the Platform in Action
        </h1>
        <p className="mt-3 text-slate-600 text-base sm:text-lg">
          Discover how our digital teaching platform can transform everyday classroom teaching in your school.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* FORM CONTAINER */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg relative">

          {isSubmitted ? (
            <div className="text-center py-12 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#096145]/10 text-[#096145] border border-[#096145]/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Demo Request Sent to WhatsApp!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <span className="text-[#006783] font-bold">{formData.name}</span>. Your demo request has been opened in WhatsApp with pre-filled details. Click send on WhatsApp to complete!
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Request School Demo</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#006783]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#006783]" /> School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier International"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation *</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  >
                    <option>Principal / Trustee</option>
                    <option>Academic Director</option>
                    <option>Department Head</option>
                    <option>Senior Teacher</option>
                    <option>IT / Tech Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#006783]" /> Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@school.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#006783]" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#006783]" /> No. of Teachers
                  </label>
                  <select
                    value={formData.numberOfTeachers}
                    onChange={(e) => setFormData({ ...formData, numberOfTeachers: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  >
                    <option>1-10 Teachers</option>
                    <option>10-25 Teachers</option>
                    <option>25-50 Teachers</option>
                    <option>50+ Teachers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">No. of Students</label>
                  <select
                    value={formData.numberOfStudents}
                    onChange={(e) => setFormData({ ...formData, numberOfStudents: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                  >
                    <option>100-300</option>
                    <option>300-700</option>
                    <option>700-1500</option>
                    <option>1500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#006783]" /> Message / Specific Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your current classroom projector setup..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#006783]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-sm text-white bg-[#006783] hover:bg-[#004e63] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request My Demo via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#096145]" />
                <span>Zero Commitment • Instant Confirmation</span>
              </div>
            </form>
          )}
        </div>

        {/* PROCESS STEPS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">What Happens Next?</h2>

            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">

              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-[#006783] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 border-4 border-white shadow-2xs">
                  01
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Request Demo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Submit the form with your school details.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-[#006783]/50 text-[#006783] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Talk to Our Team</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Our specialist schedules a convenient 20-min online slot.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-500 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">See the Platform</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customized live walkthrough of AI generators & lessons.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-500 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  04
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bring It to Your Classrooms</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Seamless pilot onboarding for your teaching staff.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
