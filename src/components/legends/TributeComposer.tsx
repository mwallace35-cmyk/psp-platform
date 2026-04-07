"use client";

import { useState } from "react";

interface Props {
  legendSlug: string;
  legendName: string;
  variant?: "default" | "memoriam";
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

/**
 * Composer form for leaving a new tribute. Posts to
 * /api/tributes/submit, which enforces rate limiting, slug validation,
 * and writes the row as status=pending for admin review.
 */
export default function TributeComposer({
  legendSlug,
  legendName,
  variant = "default",
}: Props) {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const canSubmit =
    name.trim().length > 0 &&
    body.trim().length >= 2 &&
    state.kind !== "submitting";

  const headline =
    variant === "memoriam" ? "Share a memory" : "Leave a tribute";
  const subcopy =
    variant === "memoriam"
      ? `Your words will be added to the memorial for ${legendName} after a quick review.`
      : `Share a story, a memory, or a thank-you. Your tribute will appear on ${legendName}'s page after a quick review.`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/tributes/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          legend_slug: legendSlug,
          name: name.trim(),
          affiliation: affiliation.trim() || null,
          body: body.trim(),
          email_optional: email.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setState({
          kind: "error",
          message:
            json?.error?.message ?? "Could not submit. Please try again.",
        });
        return;
      }
      setState({
        kind: "success",
        message:
          json?.data?.message ??
          "Thanks — your tribute will appear once it's reviewed.",
      });
      setName("");
      setAffiliation("");
      setBody("");
      setEmail("");
    } catch {
      setState({
        kind: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6 space-y-4"
      aria-label="Tribute composer"
    >
      <div>
        <h3 className="font-heading text-xl text-[var(--psp-navy)]">
          {headline}
        </h3>
        <p className="text-sm text-[var(--psp-gray-600)] mt-1">{subcopy}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--psp-gray-600)]">
            Your name <span className="text-[var(--psp-gold)]">*</span>
          </span>
          <input
            type="text"
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={state.kind === "submitting"}
            className="mt-1 w-full px-3 py-2 border border-[var(--psp-gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--psp-gray-600)]">
            Affiliation
          </span>
          <input
            type="text"
            maxLength={300}
            placeholder="e.g. Frankford, Class of 1978"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            disabled={state.kind === "submitting"}
            className="mt-1 w-full px-3 py-2 border border-[var(--psp-gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--psp-gray-600)]">
          Your tribute <span className="text-[var(--psp-gold)]">*</span>
        </span>
        <textarea
          required
          minLength={2}
          maxLength={8000}
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={state.kind === "submitting"}
          className="mt-1 w-full px-3 py-2 border border-[var(--psp-gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
        />
        <span className="text-xs text-[var(--psp-gray-400)]">
          {body.length} / 8000
        </span>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--psp-gray-600)]">
          Email (optional, never displayed)
        </span>
        <input
          type="email"
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state.kind === "submitting"}
          className="mt-1 w-full px-3 py-2 border border-[var(--psp-gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
        />
      </label>

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--psp-navy)] text-white font-semibold text-sm hover:bg-[var(--psp-navy-mid)] disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2"
        >
          {state.kind === "submitting" ? "Submitting\u2026" : "Submit tribute"}
        </button>
        {state.kind === "success" && (
          <p className="text-sm text-green-700" role="status">
            {state.message}
          </p>
        )}
        {state.kind === "error" && (
          <p className="text-sm text-red-700" role="alert">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
