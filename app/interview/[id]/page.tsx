"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Vapi from "@vapi-ai/web";
import { Mic } from "lucide-react";

import { Button } from "@/components/ui/button";

type InterviewRoomProps = {
  params: Promise<{ id: string }>;
};

type CallStatus = "inactive" | "loading" | "active";

const assistantConfig = {
  name: "Interviewer",
  firstMessage: "Hello, I am your AI interviewer. Are you ready to begin?",
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a strict, professional technical interviewer. Keep responses very short, under 2 sentences, and always end with a follow-up question.",
      },
    ],
  },
  voice: {
    provider: "11labs",
    voiceId: "bIHbv24MWmeRgasZH58o",
  },
} as const;

export default function InterviewRoom({ params }: InterviewRoomProps) {
  const { id } = use(params);
  const [callStatus, setCallStatus] = useState<CallStatus>("inactive");
  const [transcript, setTranscript] = useState("");
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    if (!publicKey) {
      console.error(
        new Error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY for Vapi SDK.")
      );
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    const handleCallStart = () => setCallStatus("active");
    const handleCallEnd = () => setCallStatus("inactive");
    const handleError = (error: unknown) => {
      console.error("Vapi Error:", error);
    };
    const handleMessage = (message: { type?: string; transcript?: { text?: string }; text?: string; content?: string }) => {
      if (message.type !== "transcript") {
        return;
      }

      const text =
        message.transcript?.text ?? message.text ?? message.content ?? "";

      if (text) {
        setTranscript(text);
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      vapi.stop();
      vapiRef.current = null;
    };
  }, []);

  const toggleCall = async () => {
    const vapi = vapiRef.current;

    if (!vapi) {
      return;
    }

    if (callStatus === "inactive") {
      setTranscript("");
      setCallStatus("loading");

      try {
        await vapi.start(assistantConfig);
      } catch (error) {
        console.error(error);
        setCallStatus("inactive");
      }

      return;
    }

    if (callStatus === "active") {
      vapi.stop();
    }
  };

  const statusText =
    callStatus === "active"
      ? "Interview live"
      : callStatus === "loading"
        ? "Connecting..."
        : "Tap to begin";
  const buttonLabel = callStatus === "active" ? "End call" : "Start call";
  const glowClass =
    callStatus === "active"
      ? "shadow-[0_0_75px_rgba(239,68,68,0.45)]"
      : "shadow-[0_0_60px_rgba(99,102,241,0.35)]";
  const pulseClass = callStatus === "active" ? "animate-pulse" : "";
  const ringClass =
    callStatus === "loading"
      ? "border-white/20 border-t-indigo-300/80 animate-spin"
      : "border-white/10";

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_25%,rgba(99,102,241,0.18),rgba(168,85,247,0.1)_50%,transparent_70%)]" />

      <div className="absolute right-6 top-6 z-10">
        <Button
          variant="ghost"
          className="text-white/70 hover:bg-white/10 hover:text-white"
          asChild
        >
          <Link href="/dashboard">End Interview</Link>
        </Button>
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">
          {statusText}
        </p>
        {transcript ? (
          <p className="mt-3 max-w-sm text-xs text-white/40">{transcript}</p>
        ) : null}
        <button
          type="button"
          onClick={toggleCall}
          aria-label={`${buttonLabel} for session ${id}`}
          className={`group relative mt-6 flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/10 sm:h-56 sm:w-56 ${glowClass} ${pulseClass}`}
        >
          <span className={`absolute inset-0 rounded-full border ${ringClass}`} />
          <Mic className="relative z-10 h-12 w-12 text-white/80 transition group-hover:text-white" />
        </button>
      </main>
    </div>
  );
}
