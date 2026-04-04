import type { FastifyInstance } from 'fastify';
import { createServiceClient, getWordJar } from '@study-aid/db';
import { z } from 'zod';

const GetWordJarSchema = z.object({ childId: z.string().min(1) });

export async function wordJarRoute(app: FastifyInstance) {
  app.get<{ Querystring: unknown }>('/api/word-jar', async (request, reply) => {
    const parsed = GetWordJarSchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request', message: 'childId is required' });
    }

    try {
      const supabase = createServiceClient();
      const words = await getWordJar(supabase, parsed.data.childId);
      return reply.send({ words });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'unavailable' });
    }
  });
}
