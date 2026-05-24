import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openAiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

const openai = new OpenAI({ apiKey: openAiApiKey ?? "" });

export async function POST(request: Request) {
  if (!openAiApiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY." },
      { status: 500 }
    );
  }

  let payload: {
    sessionId?: string;
    userMessage?: string;
    track?: string;
  } | null = null;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  if (!payload?.sessionId || !payload?.userMessage || !payload?.track) {
    return NextResponse.json(
      { error: "Missing sessionId, userMessage, or track." },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => {
        cookieStore.set({ name, value, ...options });
      },
      remove: (name, options) => {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error: insertUserError } = await supabase.from("transcripts").insert({
    session_id: payload.sessionId,
    role: "user",
    content: payload.userMessage,
  });

  if (insertUserError) {
    return NextResponse.json(
      { error: "Unable to save transcript." },
      { status: 500 }
    );
  }

  const { data: transcripts, error: transcriptsError } = await supabase
    .from("transcripts")
    .select("role, content, created_at")
    .eq("session_id", payload.sessionId)
    .order("created_at", { ascending: true });

  if (transcriptsError) {
    return NextResponse.json(
      { error: "Unable to load transcript history." },
      { status: 500 }
    );
  }

  const systemPrompt = `You are a strict, professional technical interviewer for the ${payload.track} track. Keep every response to 1-2 sentences max and usually end with a follow-up question.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(transcripts ?? []).map((entry) => ({
      role: entry.role === "user" ? "user" : "assistant",
      content: entry.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.4,
  });

  const aiResponseText = completion.choices[0]?.message?.content?.trim();

  if (!aiResponseText) {
    return NextResponse.json(
      { error: "Empty AI response." },
      { status: 500 }
    );
  }

  const { error: insertAiError } = await supabase.from("transcripts").insert({
    session_id: payload.sessionId,
    role: "ai",
    content: aiResponseText,
  });

  if (insertAiError) {
    return NextResponse.json(
      { error: "Unable to save AI response." },
      { status: 500 }
    );
  }

  return NextResponse.json({ reply: aiResponseText });
}
