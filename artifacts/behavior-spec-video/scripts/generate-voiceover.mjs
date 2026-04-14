import OpenAI from "openai";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "audio");

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const VOICE = "alloy";

const SCENES = [
  {
    name: "scene1",
    maxDuration: 17,
    text: "After Pro launched the Bryte chatbot last year. Out of the 1548 thumb down reviews, 280 said Bryte gave them nothing, 159 said that it's unhelpful and 70 said that Bryte didn't provide the answer what they asked.",
  },
  {
    name: "scene_transition",
    maxDuration: 25,
    text: "Behind every thumbs down is someone confused about their paycheck, or dealing with life event changes, or just trying to get a straight answer. Without behavioral rules, Bryte treats every conversation the same. But these moments aren't the same. Gemini knows how to be helpful but it just doesn't know what being Bryte actually means.",
  },
  {
    name: "scene2",
    maxDuration: 43,
    text: "A behavior spec is a set of design rules that tells Bryte AI exactly how to act in any situation. The schema defines what's possible. The spec defines how to choose. Our spec has 8 sections — intent detection, routing, context management, memory, guardrails, tone, response formatting, and fallback recovery. Each section defines rules for a specific behavior — what triggers it, how the AI should respond, and what good looks like. It's the difference between an AI that just replies... and one you can actually trust. For example, the user said: help me request leave for next month without messing up coverage",
  },
  {
    name: "scene3",
    maxDuration: 22,
    text: "Without the spec, Bryte immediately proceeds to gather details for the leave request, without first resolving the coverage ambiguity. With the spec, Bryte pauses the primary task, the leave request, to first ask what the user means by coverage. ... Without the spec, Bryte guesses. With it, Bryte knows what to do.",
  },
  {
    name: "scene4",
    maxDuration: 40,
    text: "We asked Bryte the same question three times... why is my pay short. ...... First time, it compared two pay statements in a table. ...... Second, it showed a full pay breakdown. ...... Third, Bryte explained to the user that their paycheck was actually higher, due to overtime pay. Same question... three completely different answers. But with a spec, good answers aren't accidental. They're repeatable by design. Acknowledgment of concern, every time. Structured data, every time. Clear next step, every time.",
  },
  {
    name: "scene6a",
    maxDuration: 6,
    text: "The user asked... How much PTO have I accrued?",
  },
  {
    name: "scene6b",
    maxDuration: 9,
    text: "Without the spec, two out of three attempts failed. With it? Three for three. ... Why? The Orchestrator sees 67 agents. Two of them — Accruals and Time Off — both look like a match.",
  },
  {
    name: "scene7b_p1",
    maxDuration: 42,
    text: "Let's see what this looks like in practice. In our first example, the user needs to request leave for next month — but they don't want to mess up coverage for their team. Sounds simple, right? But that word coverage means very different things depending on context. ... The orchestrator starts with guardrails. Fourteen safety rules scanned in priority order. ... All clear — the query moves forward. ... Next, intent detection. The word coverage is ambiguous. ... Rule ID-05 fires: ask one clarifying question. ... Bryte responds: when you say coverage, do you mean team shift coverage, or benefits coverage?",
  },
  {
    name: "scene7b_p2",
    maxDuration: 24,
    text: "The user replies: team shifts. Memory stores the clarification — no repeat questions. And now the orchestrator detects a compound intent — two tasks: check shift coverage first, then submit the leave request. The context bundle is assembled for handoff. But before any agent responds, there's one more thing to set.",
  },
  {
    name: "scene_orch_tone",
    maxDuration: 10,
    text: "Tone is locked. Empowering, effortless, grounded, supportive. Every agent speaks with one voice.",
  },
  {
    name: "scene_orch_routing",
    maxDuration: 8,
    text: "The orchestrator routes to the Schedule Agent first. Context travels with the handoff. The orchestrator's job is done.",
  },
  {
    name: "scene_inside_spec",
    maxDuration: 40,
    text: "Seventy rules across eight sections. That's what's inside the spec. But here's the part that matters at runtime — not every rule goes to the same place. The spec splits. Rules that govern decisions — which agent to call, what context to pass, what to remember — route to the orchestrator. Rules that govern output — how to sound, how to format, how to recover — route to the agent. Shared rules go to both. Two runtimes. One spec. Every rule lands exactly where it's enforced.",
  },
  {
    name: "scene_orchestration_scale",
    maxDuration: 30,
    text: "The agent spec isn't copied into each agent. It's injected at runtime. The orchestrator calls an agent, and the spec loads straight into the prompt. Update one file, all sixty-seven agents get the change. Two specs. Sixty-seven agents. Injected on demand. One source of truth — crafted and maintained by the design team — always live, never stale.",
  },
  {
    name: "scene5",
    maxDuration: 23,
    text: "Every thumbs down is a person who needed help and didn't get it. A behavior spec makes sure that doesn't happen — not by chance, but by design. Same question, same quality answer. Right agent, every time. Clear next steps, always. That's what it means to go from design intent to production behavior. That's Behavior Spec.",
  },
  {
    name: "scene7b_c1",
    maxDuration: 15,
    text: "The agent receives the request. Guardrails activate first — never fabricate data, approved links only. the tone: empowering, effortless. The same voice the orchestrator set.",
  },
  {
    name: "scene6b_bridge",
    maxDuration: 8,
    text: "The user's question mentions both PTO and accrued. One agent keys on accrued, the other on PTO. Without a routing rule, it either misroutes or fails.",
  },
  {
    name: "scene6d",
    maxDuration: 25,
    text: "The spec fixes this with one key rule — disambiguation. Rule ID-05 tells the orchestrator to analyze the full message before deciding where to route. How much PTO have I accrued — accrued resolves intent directly to the Accruals Agent. The schema tells the LLM what's available. The spec tells it how to choose correctly.",
  },
];

async function generateScene(scene) {
  console.log(`Generating voiceover for ${scene.name}...`);

  const response = await openai.chat.completions.create({
    model: "gpt-audio",
    modalities: ["text", "audio"],
    audio: { voice: VOICE, format: "wav" },
    messages: [
      {
        role: "system",
        content:
          "You are a text-to-speech engine. Read ONLY the exact words provided. Do NOT add, remove, change, paraphrase, or embellish ANY word. Do NOT add examples, domain terms, or explanations. Simply read the text word-for-word in a calm, professional, slightly brisk tone like a modern tech explainer video.",
      },
      {
        role: "user",
        content: `Read this text exactly as a voiceover: ${scene.text}`,
      },
    ],
  });

  const audioData = response.choices[0]?.message?.audio?.data;
  if (!audioData) {
    throw new Error(`No audio data returned for ${scene.name}`);
  }

  const buffer = Buffer.from(audioData, "base64");
  const rawPath = join(OUTPUT_DIR, `${scene.name}_raw.wav`);
  const outputPath = join(OUTPUT_DIR, `${scene.name}.wav`);
  await writeFile(rawPath, buffer);

  const durationStr = execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${rawPath}"`
  ).toString().trim();
  const actualDuration = parseFloat(durationStr);
  console.log(`  Raw duration: ${actualDuration.toFixed(2)}s (max: ${scene.maxDuration}s)`);

  if (actualDuration > scene.maxDuration) {
    execSync(
      `ffmpeg -y -i "${rawPath}" -t ${scene.maxDuration} -af "afade=t=out:st=${scene.maxDuration - 0.3}:d=0.3" "${outputPath}" 2>/dev/null`
    );
    console.log(`  Trimmed to ${scene.maxDuration}s with fade-out`);
  } else {
    await writeFile(outputPath, await readFile(rawPath));
  }

  await unlink(rawPath).catch(() => {});
  const finalSize = (await readFile(outputPath)).length;
  console.log(`  Saved ${outputPath} (${(finalSize / 1024).toFixed(1)} KB)`);
  return outputPath;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Generating AI voiceover for all scenes...\n");

  const only = process.argv[2];
  const scenesToRun = only ? SCENES.filter(s => s.name === only) : SCENES;
  for (const scene of scenesToRun) {
    try {
      await generateScene(scene);
    } catch (err) {
      console.error(`  ERROR generating ${scene.name}:`, err.message);
    }
  }

  console.log("\nDone! Audio files saved to public/audio/");
}

main().catch(console.error);
