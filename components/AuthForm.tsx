"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else onAuth();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
      }
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 flex gap-6 border-b border-line font-mono text-xs uppercase tracking-widest">
        <button
          onClick={() => setMode("signin")}
          className={`-mb-px border-b-2 pb-3 ${
            mode === "signin"
              ? "border-ink text-ink"
              : "border-transparent text-muted"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`-mb-px border-b-2 pb-3 ${
            mode === "signup"
              ? "border-ink text-ink"
              : "border-transparent text-muted"
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </label>

        {error && <p className="text-sm text-alert">{error}</p>}
        {notice && <p className="text-sm text-muted">{notice}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brandDark disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : mode === "signin"
            ? "Sign in"
            : "Create account"}
        </button>
      </form>
    </div>
  );
}
