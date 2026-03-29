"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";

export function TestSnapshotButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Push a sample snapshot into the live dashboard.");

  const runTest = async () => {
    setStatus("loading");
    setMessage("Sending test snapshot...");

    try {
      const response = await fetch("/api/minecraft/test-snapshot", {
        method: "POST",
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Failed to send the test snapshot.");
        return;
      }

      setStatus("success");
      setMessage("Test snapshot sent. Refresh or watch the dashboard update live.");
    } catch {
      setStatus("error");
      setMessage("Network error while sending the test snapshot.");
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={runTest}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-300/18 bg-emerald-400/12 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/18 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FlaskConical className="h-4 w-4" />
        <span>{status === "loading" ? "Sending..." : "Send test snapshot"}</span>
      </button>
      <p
        className={`text-sm leading-6 ${
          status === "error"
            ? "text-rose-300"
            : status === "success"
              ? "text-emerald-200"
              : "text-slate-400"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
