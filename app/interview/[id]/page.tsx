"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic } from "lucide-react";

import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

type InterviewRoomProps = {
  params: Promise<{ id: string }>;
};

type InterviewStatus = "idle" | "listening" | "thinking" | "speaking";

export default function InterviewRoom({ params }: InterviewRoomProps) {
  const { id } = use(params);
  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [track, setTrack] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasResultRef = useRef(false);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("track")
        .eq("id", id)
        .single();

      if (!isActive) {
        return;
      }

      if (error) {
        setErrorMessage("Unable to load session track.");
        return;
      }

      setTrack(data?.track ?? null);
    };

    loadSession();

    return () => {
      isActive = false;
    };
  }, [id]);

  const speakResponse = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("idle");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      setStatus("thinking");
      setErrorMessage("");

      try {
        const response = await fetch("/api/interview/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: id,
            userMessage: message,
            track: track ?? "General",
          }),
        });

        const data = (await response.json()) as { reply?: string; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "AI request failed.");
        }

        if (!data.reply) {
          setStatus("idle");
          return;
        }

        setStatus("speaking");
        speakResponse(data.reply);
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to reach the AI interviewer.");
        setStatus("idle");
      }
    },
    [id, speakResponse, track]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionConstructor =
      window.SpeechRecognition ||
      (window as typeof window & {
        webkitSpeechRecognition?: typeof SpeechRecognition;
      }).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setErrorMessage("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const result = event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (!result) {
        return;
      }

      hasResultRef.current = true;
      setTranscript(result);
      sendMessage(result);
    };

    recognition.onerror = () => {
      if (statusRef.current === "listening") {
        setStatus("idle");
      }
    };

    recognition.onend = () => {
      if (statusRef.current === "listening" && !hasResultRef.current) {
        setStatus("idle");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [sendMessage]);

  const toggleRecording = () => {
    if (status === "idle") {
      if (!recognitionRef.current) {
        setErrorMessage("Speech recognition is not available.");
        return;
      }

      setTranscript("");
      setErrorMessage("");
      hasResultRef.current = false;
      recognitionRef.current.start();
      setStatus("listening");
      return;
    }

    if (status === "listening") {
      recognitionRef.current?.stop();
    }
  };

  const statusText =
    status === "listening"
      ? "Listening..."
      : status === "thinking"
        ? "AI is thinking..."
        : status === "speaking"
          ? "AI is speaking..."
          : "Tap to start listening";
  const buttonLabel = status === "listening" ? "Pause listening" : "Start listening";
  const glowClass =
    status === "listening"
      ? "shadow-[0_0_70px_rgba(239,68,68,0.45)]"
      : status === "thinking"
        ? "shadow-[0_0_60px_rgba(99,102,241,0.35)]"
        : status === "speaking"
          ? "shadow-[0_0_85px_rgba(99,102,241,0.55)]"
          : "shadow-[0_0_60px_rgba(99,102,241,0.35)]";
  const pulseClass = status === "listening" ? "animate-pulse" : "";
  const ringClass =
    status === "thinking"
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
        {track ? (
          <p className="mt-2 text-xs text-white/40">{track}</p>
        ) : null}
        {transcript ? (
          <p className="mt-3 max-w-sm text-xs text-white/40">{transcript}</p>
        ) : null}
        {errorMessage ? (
          <p className="mt-3 text-xs text-red-400">{errorMessage}</p>
        ) : null}
        <button
          type="button"
          onClick={toggleRecording}
          aria-label={`${buttonLabel} for session ${id}`}
          className={`group relative mt-6 flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/10 sm:h-56 sm:w-56 ${glowClass} ${pulseClass}`}
        >
          <span
            className={`absolute inset-0 rounded-full border ${ringClass}`}
          />
          <Mic className="relative z-10 h-12 w-12 text-white/80 transition group-hover:text-white" />
        </button>
      </main>
    </div>
  );
}
