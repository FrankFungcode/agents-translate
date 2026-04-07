import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';
import { AgentCore } from './core/agent-core';
import { DIRECTIONS } from './core/types';

type EnvBindings = {
  OPENAI_API_KEY: string;
  OPENAI_MODEL?: string;
  CORS_ORIGIN?: string;
};

const translateSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  direction: z.enum(DIRECTIONS),
  context: z.string().trim().max(500).optional(),
});

const app = new Hono<{ Bindings: EnvBindings }>();

app.use(
  '*',
  cors({
    origin: (origin, c) => {
      const allowedRaw = c.env.CORS_ORIGIN ?? '*';
      if (allowedRaw === '*') {
        return origin ?? '*';
      }

      const allowList = allowedRaw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (!origin) {
        return allowList[0] ?? '*';
      }

      return allowList.includes(origin) ? origin : allowList[0] ?? '*';
    },
  }),
);

app.get('/', (c) => c.json({ name: 'agents-translate-api', ok: true }));
app.get('/api/health', (c) =>
  c.json({
    ok: true,
    service: 'agents-translate-api',
    hasOpenAIKey: Boolean(c.env.OPENAI_API_KEY),
    timestamp: new Date().toISOString(),
  }),
);

app.post('/api/translate', async (c) => {
  const body = await c.req.json();
  const input = translateSchema.parse(body);
  const agent = new AgentCore({
    openAIApiKey: c.env.OPENAI_API_KEY,
    openAIModel: c.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  });
  const result = await agent.translate(input);
  return c.json(result);
});

app.get('/api/translate/stream', async (c) => {
  const input = translateSchema.parse({
    content: c.req.query('content'),
    direction: c.req.query('direction'),
    context: c.req.query('context') ?? undefined,
  });

  const agent = new AgentCore({
    openAIApiKey: c.env.OPENAI_API_KEY,
    openAIModel: c.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  });

  return streamSSE(c, async (stream) => {
    const generator = agent.streamTranslate(input);
    let finalValue;

    while (true) {
      const next = await generator.next();
      if (next.done) {
        finalValue = next.value;
        break;
      }

      await stream.writeSSE({
        data: JSON.stringify({ token: next.value }),
      });
    }

    await stream.writeSSE({
      data: JSON.stringify({
        done: true,
        result: finalValue.result,
        direction: finalValue.direction,
        detectedPerspective: finalValue.detectedPerspective,
        missingInfo: finalValue.missingInfo,
      }),
    });
  });
});

export default app;
