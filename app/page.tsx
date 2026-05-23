"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Briefcase, Mic } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.61, 0.35, 1] },
  },
};

const features: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Industry-Specific Scenarios",
    description:
      "Train with prompts tailored to your role, seniority, and target companies, from PM to SWE leadership.",
    Icon: Briefcase,
  },
  {
    title: "Real-Time AI Voice Interaction",
    description:
      "Speak naturally while the AI interviewer adapts live, presses on weak points, and tracks clarity.",
    Icon: Mic,
  },
  {
    title: "Deep Analytics & Feedback",
    description:
      "Instant signal on confidence, structure, and delivery, plus action items you can practice right away.",
    Icon: BarChart3,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-[620px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-40 right-[-120px] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
              <Mic className="h-5 w-5 text-indigo-300" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Interview AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Button>
            <Button className="bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-24 pt-20">
        <motion.section
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <Badge className="w-fit border border-white/10 bg-white/5 text-white/80">
              AI Interview Studio
            </Badge>
            <h1 className="text-5xl font-semibold tracking-tight text-white md:text-7xl font-['Fraunces']">
              Built for the next big leap.
              <span className="mt-3 block bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                Master Your Interview
              </span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Practice with a real-time AI interviewer, get instant actionable
              feedback, and land your dream job.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_35px_rgba(99,102,241,0.45)] transition hover:shadow-[0_0_50px_rgba(99,102,241,0.65)]"
              >
                Start Free Session
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                How it works
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                24/7 AI interviewer
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
                Live voice analysis
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                Hiring-grade feedback
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-indigo-500/15 via-transparent to-purple-500/15 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(5,8,20,0.65)] backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <Badge className="border border-white/10 bg-white/10 text-white/80">
                  Live Session
                </Badge>
                <span className="text-xs text-white/60">00:12</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/80">
                    AI Interviewer: Tell me about a time you resolved a
                    conflict.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4">
                  <p className="text-sm text-white">
                    You: I aligned stakeholders by framing priorities and
                    outlining tradeoffs.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Confidence Score</span>
                  <span className="text-indigo-200">92%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[92%] bg-gradient-to-r from-indigo-400 to-purple-500" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  Voice clarity: 4.8/5
                </div>
                <div className="text-white/70">Next prompt in 10s</div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="space-y-10"
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">
              Built for outcomes
            </p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Everything you need to win the room
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Craft compelling answers, sharpen your delivery, and track
              progress with insights that feel like a real hiring panel.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="group h-full border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(10,12,24,0.35)]">
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-200 ring-1 ring-white/10 transition group-hover:bg-indigo-500/20 group-hover:text-white">
                      <feature.Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
