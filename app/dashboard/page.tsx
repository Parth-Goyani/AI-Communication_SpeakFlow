import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SignOutButton } from "./sign-out-button";
import { StartSessionCard } from "./start-session-card";

type SessionRow = {
  id: string;
  track: string;
  status: string;
  created_at: string;
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const getStatusBadge = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === "completed") {
    return {
      label: "Completed",
      className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
    };
  }

  if (normalized === "active") {
    return {
      label: "Active",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    };
  }

  return {
    label: status,
    className: "border-white/10 bg-white/5 text-white/70",
  };
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (!user || error) {
    redirect("/login");
  }

  const { data: sessionsData } = await supabase
    .from("sessions")
    .select("id, track, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const sessions = (sessionsData ?? []) as SessionRow[];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.16),rgba(168,85,247,0.12)_45%,transparent_70%)]" />

      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-white">
            Interview AI
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>{user.email ?? "Signed in"}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <StartSessionCard userId={user.id} />

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Recent Sessions
                </h2>
                <p className="text-sm text-white/60">
                  Review your latest interview sessions and feedback.
                </p>
              </div>
              <Badge className="border-white/10 bg-white/5 text-white/70">
                Last 30 days
              </Badge>
            </div>

            {sessions.length ? (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/60">Date</TableHead>
                      <TableHead className="text-white/60">Track</TableHead>
                      <TableHead className="text-white/60">Status</TableHead>
                      <TableHead className="text-right text-white/60">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => {
                      const statusBadge = getStatusBadge(session.status);
                      const isCompleted = session.status === "completed";

                      return (
                        <TableRow key={session.id} className="border-white/10">
                          <TableCell className="text-white/80">
                            {formatDate(session.created_at)}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {session.track}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`border ${statusBadge.className}`}
                            >
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {isCompleted ? (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white/80 hover:bg-white/10"
                              >
                                <Link href={`/interview/${session.id}`}>
                                  View Feedback
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="border-white/10 text-white/40"
                              >
                                View Feedback
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 bg-white/5 py-12 text-center text-white/70 backdrop-blur-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Sparkles className="h-5 w-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-base font-medium text-white">
                    No interviews yet
                  </p>
                  <p className="text-sm text-white/60">
                    Start your first session above to see results here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
