import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  CausalRipplesSchema,
  EmergentTensionSchema,
  ReasoningPayloadSchema,
  type ReasonResponseBody,
} from '@/types/scenario';
import {
  buildUserPrompt,
  GEMINI_RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
} from '@/lib/prompt-templates';
import { generateDemoReasoning } from '@/lib/demo-engine';

export const runtime = 'edge';

const ReasonRequestSchema = z.object({
  premise: z.string().trim().min(2, 'Premise must be at least 2 characters.'),
  parentNode: z
    .object({
      premise: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      ripples: CausalRipplesSchema,
      tensions: z.array(EmergentTensionSchema),
    })
    .optional(),
  lineage: z
    .array(
      z.object({
        premise: z.string().trim().min(1),
        summary: z.string().trim().min(1),
        divergenceTrigger: z.string().optional(),
      })
    )
    .optional(),
  divergenceTrigger: z.string().trim().min(1).optional(),
  mode: z.enum(['auto', 'gemini', 'demo']).optional().default('auto'),
  apiKey: z.string().trim().optional(),
});

async function invokeGeminiReasoning(params: {
  apiKey: string;
  model: string;
  userPrompt: string;
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    params.model
  )}:generateContent?key=${encodeURIComponent(params.apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: params.userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.75,
        responseMimeType: 'application/json',
        responseSchema: GEMINI_RESPONSE_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    let detail = `Gemini API returned HTTP ${response.status}`;
    try {
      const errJson = (await response.json()) as {
        error?: { message?: string };
      };
      if (errJson.error?.message) {
        detail = errJson.error.message;
      }
    } catch {
      // keep default detail
    }
    throw new Error(detail);
  }

  const rawResult = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const text = rawResult.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response payload.');
  }

  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini output was not valid JSON.');
  }

  const validated = ReasoningPayloadSchema.safeParse(parsed);
  if (!validated.success) {
    const firstIssue = validated.error.issues[0];
    throw new Error(
      `Schema validation failed: ${
        firstIssue
          ? `${firstIssue.path.join('.')} ${firstIssue.message}`
          : 'Unexpected structure'
      }`
    );
  }

  return validated.data;
}

export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  const parsedRequest = ReasonRequestSchema.safeParse(rawBody);
  if (!parsedRequest.success) {
    const issue = parsedRequest.error.issues[0];
    return NextResponse.json(
      {
        error: issue
          ? `${issue.path.join('.') || 'request'}: ${issue.message}`
          : 'Invalid reasoning request.',
      },
      { status: 400 }
    );
  }

  const body = parsedRequest.data;
  const effectiveApiKey = body.apiKey || process.env.GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // Explicit Local Demo Mode
  if (body.mode === 'demo') {
    const demoData = generateDemoReasoning(body);
    const payload: ReasonResponseBody = {
      data: demoData,
      meta: {
        engine: 'demo',
        model: 'local-first-principles-v1',
      },
    };
    return NextResponse.json(payload);
  }

  // Missing API Key handling
  if (!effectiveApiKey) {
    if (body.mode === 'gemini') {
      return NextResponse.json(
        {
          error:
            'No Gemini API key configured. Set GEMINI_API_KEY in .env.local or enter a session key in Engine Settings.',
        },
        { status: 400 }
      );
    }

    const demoData = generateDemoReasoning(body);
    const payload: ReasonResponseBody = {
      data: demoData,
      meta: {
        engine: 'demo',
        model: 'local-first-principles-v1',
        fallbackReason:
          'No GEMINI_API_KEY configured — using built-in local first-principles engine.',
      },
    };
    return NextResponse.json(payload);
  }

  // Live Gemini API Reasoning
  try {
    const userPrompt = buildUserPrompt({
      premise: body.premise,
      parentNode: body.parentNode,
      lineage: body.lineage,
      divergenceTrigger: body.divergenceTrigger,
    });

    const validatedData = await invokeGeminiReasoning({
      apiKey: effectiveApiKey,
      model,
      userPrompt,
    });

    const payload: ReasonResponseBody = {
      data: validatedData,
      meta: {
        engine: 'gemini',
        model,
      },
    };
    return NextResponse.json(payload);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown Gemini API error';

    if (body.mode === 'gemini') {
      return NextResponse.json(
        { error: `Gemini reasoning failed: ${message}` },
        { status: 502 }
      );
    }

    // Auto mode: gracefully degrade to local first-principles engine
    const demoData = generateDemoReasoning(body);
    const payload: ReasonResponseBody = {
      data: demoData,
      meta: {
        engine: 'demo',
        model: 'local-first-principles-v1',
        fallbackReason: `Gemini API unavailable (${message}) — fell back to local engine.`,
      },
    };
    return NextResponse.json(payload);
  }
}
