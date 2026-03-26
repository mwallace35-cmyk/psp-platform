"use client";

import { useState } from "react";

type FormType = "minor" | "adult";

export default function ReleaseFormClient() {
  const [formType, setFormType] = useState<FormType>("minor");

  return (
    <div className="min-h-screen" style={{ background: "#0a1628" }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-white font-heading"
            style={{ fontSize: "2rem", letterSpacing: "0.05em" }}
          >
            PHILLY<span style={{ color: "var(--psp-gold)" }}>SPORTS</span>PACK
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Photo & Media Release Form
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-lg overflow-hidden mb-8 border-2" style={{ borderColor: "var(--psp-gold)" }}>
          <button
            onClick={() => setFormType("minor")}
            className="flex-1 py-3 px-4 text-sm font-bold transition-all"
            style={{
              background: formType === "minor" ? "var(--psp-gold)" : "transparent",
              color: formType === "minor" ? "var(--psp-navy)" : "var(--psp-gold)",
            }}
          >
            Student Athlete (Under 18)
          </button>
          <button
            onClick={() => setFormType("adult")}
            className="flex-1 py-3 px-4 text-sm font-bold transition-all"
            style={{
              background: formType === "adult" ? "var(--psp-gold)" : "transparent",
              color: formType === "adult" ? "var(--psp-navy)" : "var(--psp-gold)",
            }}
          >
            Adult (18+)
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#fff", borderTop: "4px solid var(--psp-gold)" }}>
          <div className="p-6 sm:p-8">
            {/* Title */}
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--psp-navy)" }}>
              Photo & Media Release
            </h2>
            <div className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: "var(--psp-gold)" }}>
              {formType === "minor"
                ? "Minor Athlete \u2014 Parent / Guardian Authorization"
                : "Adult Consent \u2014 Age 18 or Older"}
            </div>

            {/* Grant Text */}
            <div
              className="text-sm leading-relaxed p-4 rounded-r mb-6"
              style={{
                background: "#f9f9f9",
                borderLeft: "3px solid var(--psp-navy)",
                color: "#333",
              }}
            >
              {formType === "minor" ? (
                <>
                  I, the undersigned parent or legal guardian of the student athlete named below, hereby grant{" "}
                  <strong>PhillySportsPack.com</strong> (&quot;PSP&quot;) and its authorized representatives permission to
                  photograph and/or record my child in connection with their participation in Philadelphia-area
                  high school athletic events. I authorize PSP to use, display, and publish these images and
                  recordings — including on its website, social media channels, printed materials, and promotional
                  content — without compensation to me or my child. This grant is non-exclusive, worldwide, and
                  covers any media now known or hereafter developed. I understand that PSP will not sell images
                  of my child to third parties. I may revoke this consent at any time by contacting{" "}
                  <strong>info@phillysportspack.com</strong>; prior uses will not be affected.
                </>
              ) : (
                <>
                  I, the undersigned, hereby grant <strong>PhillySportsPack.com</strong> (&quot;PSP&quot;) and its authorized
                  representatives permission to photograph and/or record me in connection with my participation in
                  Philadelphia-area high school athletic events. I authorize PSP to use, display, and publish these
                  images and recordings — including on its website, social media channels, printed materials, and
                  promotional content — without compensation. This grant is non-exclusive, worldwide, and covers any
                  media now known or hereafter developed. I understand that PSP will not sell images of me to third
                  parties. I may revoke this consent at any time by contacting{" "}
                  <strong>info@phillysportspack.com</strong>; prior uses will not be affected.
                </>
              )}
            </div>

            {formType === "minor" ? <MinorForm /> : <AdultForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 mt-6 pb-1 border-b border-gray-100">
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 mb-1.5">
        {label} {required && <span style={{ color: "var(--psp-gold)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--psp-navy)] focus:ring-2 focus:ring-[var(--psp-navy)]/10 transition-colors";
const selectClass = inputClass + " bg-white";

function MinorForm() {
  return (
    <form>
      <SectionLabel>Student Athlete Information</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="First Name" required>
          <input className={inputClass} type="text" placeholder="First name" required />
        </Field>
        <Field label="Last Name" required>
          <input className={inputClass} type="text" placeholder="Last name" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="School" required>
          <input className={inputClass} type="text" placeholder="e.g. Roman Catholic High School" required />
        </Field>
        <Field label="Graduation Year" required>
          <select className={selectClass} required>
            <option value="">Select year</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
            <option>2030</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="Primary Sport" required>
          <input className={inputClass} type="text" placeholder="e.g. Basketball, Football, Track" required />
        </Field>
        <Field label="Additional Sport(s)">
          <input className={inputClass} type="text" placeholder="Optional" />
        </Field>
      </div>

      <SectionLabel>Parent / Guardian Information</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="Parent / Guardian Full Name" required>
          <input className={inputClass} type="text" placeholder="Full name" required />
        </Field>
        <Field label="Relationship to Athlete" required>
          <select className={selectClass} required>
            <option value="">Select</option>
            <option>Parent</option>
            <option>Legal Guardian</option>
            <option>Other</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="Email Address" required>
          <input className={inputClass} type="email" placeholder="your@email.com" required />
        </Field>
        <Field label="Phone Number">
          <input className={inputClass} type="tel" placeholder="(215) 555-0100" />
        </Field>
      </div>

      <SignatureBlock />
      <PrivacyNotice />
      <SubmitButton />
    </form>
  );
}

function AdultForm() {
  return (
    <form>
      <SectionLabel>Your Information</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="First Name" required>
          <input className={inputClass} type="text" placeholder="First name" required />
        </Field>
        <Field label="Last Name" required>
          <input className={inputClass} type="text" placeholder="Last name" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="Role / Affiliation" required>
          <select className={selectClass} required>
            <option value="">Select</option>
            <option>Athlete (18+)</option>
            <option>Coach</option>
            <option>Athletic Director</option>
            <option>School Staff</option>
            <option>Media / Photographer</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="School or Organization" required>
          <input className={inputClass} type="text" placeholder="e.g. La Salle College High School" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label="Email Address" required>
          <input className={inputClass} type="email" placeholder="your@email.com" required />
        </Field>
        <Field label="Phone Number">
          <input className={inputClass} type="tel" placeholder="(215) 555-0100" />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-3">
        <Field label="Sport(s) / Context">
          <input className={inputClass} type="text" placeholder="e.g. Boys Basketball, Track & Field — optional" />
        </Field>
      </div>

      <SignatureBlock />
      <PrivacyNotice />
      <SubmitButton />
    </form>
  );
}

function SignatureBlock() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 mt-7">
      <Field label="Signature" required>
        <input
          type="text"
          placeholder="Type your full name"
          required
          className="border-0 border-b-2 border-gray-900 px-0 py-2 text-lg focus:outline-none focus:border-[var(--psp-navy)] transition-colors"
          style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
        />
      </Field>
      <Field label="Date" required>
        <input
          type="date"
          required
          className="border-0 border-b-2 border-gray-900 px-0 py-2 text-sm focus:outline-none focus:border-[var(--psp-navy)] transition-colors bg-transparent"
          defaultValue={new Date().toISOString().split("T")[0]}
        />
      </Field>
    </div>
  );
}

function PrivacyNotice() {
  return (
    <div className="text-xs text-gray-500 leading-relaxed mt-5 p-3.5 bg-gray-50 rounded">
      <strong className="text-gray-700">Privacy Notice:</strong> PSP collects this information solely to document consent for media use.
      Your contact information will not be shared with third parties or used for marketing purposes.
      Student athlete profiles on PSP display athletic performance data only — no personal contact
      information is published. For questions, contact <strong className="text-gray-700">info@phillysportspack.com</strong>.
    </div>
  );
}

function SubmitButton() {
  return (
    <div className="text-center mt-7">
      <button
        type="submit"
        className="text-white font-bold py-3.5 px-10 rounded-lg text-sm tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
        style={{ background: "var(--psp-gold)" }}
      >
        Submit Release Form
      </button>
      <p className="text-[11px] text-gray-400 mt-2">
        Or print this page and return a signed copy to your school&apos;s athletic director.
      </p>
    </div>
  );
}
