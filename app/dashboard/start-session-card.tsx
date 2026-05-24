"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tracks = [
  { value: "Frontend Engineering", label: "Frontend Engineering" },
  { value: "Backend Engineering", label: "Backend Engineering" },
  { value: "Product Management", label: "Product Management" },
  { value: "HR / Behavioral", label: "HR / Behavioral" },
];

type StartSessionCardProps = {
  userId: string;
};

export function StartSessionCard({ userId }: StartSessionCardProps) {
  const router = useRouter();
  const [track, setTrack] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBeginSession = async () => {
    if (!track) {
      setErrorMessage("Select an interview track to continue.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const { data, error } = await supabase
      .from("sessions")
      .insert({ user_id: userId, track, status: "active" })
      .select("id")
      .single();

    if (error || !data) {
      setErrorMessage(error?.message ?? "Unable to start a new session.");
      setIsLoading(false);
      return;
    }

    router.push(`/interview/${data.id}`);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-indigo-500/40 via-purple-500/15 to-indigo-500/40 p-[1px]">
      <Card className="border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(5,8,20,0.55)] backdrop-blur-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-white">
            Start New Interview
          </CardTitle>
          <p className="text-sm text-white/60">
            Choose a track and launch a live AI interview session.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-white/50">
              Interview Track
            </label>
            <Select value={track} onValueChange={setTrack}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white focus:ring-purple-500 focus:ring-offset-0">
                <SelectValue placeholder="Select your track" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-950 text-white">
                {tracks.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errorMessage ? (
            <p className="text-sm text-red-400">{errorMessage}</p>
          ) : null}
          <Button
            type="button"
            onClick={handleBeginSession}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_35px_rgba(99,102,241,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(99,102,241,0.6)]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting Session
              </span>
            ) : (
              "Begin Session"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
