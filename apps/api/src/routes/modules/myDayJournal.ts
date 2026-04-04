import type { FastifyInstance } from 'fastify';
import { invokeStructured, myDayJournalSystemPrompt } from '@study-aid/ai';
import {
  JournalFeedbackRequestSchema,
  JournalFeedbackResultSchema,
} from '@study-aid/types';
import type { JournalFeedbackResult } from '@study-aid/types';

export async function myDayJournalRoute(app: FastifyInstance) {
  app.post<{ Body: unknown }>('/api/modules/my-day-journal/feedback', async (request, reply) => {
    const parsed = JournalFeedbackRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    const { sceneLabel, childText, difficultyLevel } = parsed.data;

    try {
      const userPrompt = `The child chose a scene: "${sceneLabel}"
The child wrote: "${childText}"
Please respond warmly and ask one gentle follow-up question — like a conversation, not a test.`;

      const feedback = await invokeStructured<JournalFeedbackResult>(
        myDayJournalSystemPrompt(difficultyLevel),
        userPrompt,
        JournalFeedbackResultSchema,
      );

      return reply.send({ feedback });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'feedback_unavailable', message: 'Please try again.' });
    }
  });
}
