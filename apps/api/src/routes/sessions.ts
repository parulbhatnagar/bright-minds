import type { FastifyInstance } from 'fastify';
import { createServiceClient, createSession, completeSession } from '@study-aid/db';
import { StartSessionRequestSchema, CompleteSessionRequestSchema } from '@study-aid/types';

export async function sessionsRoute(app: FastifyInstance) {
  app.post<{ Body: unknown }>('/api/sessions/start', async (request, reply) => {
    const parsed = StartSessionRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    try {
      const supabase = createServiceClient();
      const session = await createSession(supabase, parsed.data.childId, parsed.data.module);
      return reply.send({ session });
    } catch (err) {
      app.log.error(err);
      // Non-blocking: return a placeholder so the UI can continue
      return reply.status(503).send({ error: 'session_unavailable' });
    }
  });

  app.post<{ Body: unknown }>('/api/sessions/complete', async (request, reply) => {
    const parsed = CompleteSessionRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    try {
      const supabase = createServiceClient();
      const session = await completeSession(supabase, parsed.data.sessionId, parsed.data.starsEarned);
      return reply.send({ session });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'session_unavailable' });
    }
  });
}
