import type { FastifyInstance } from 'fastify';
import { createAIProvider } from '@study-aid/ai';
import { FeedbackRequestSchema } from '@study-aid/types';
import type { FeedbackResponse } from '@study-aid/types';

const ai = createAIProvider();

export async function feedbackRoute(app: FastifyInstance) {
  app.post<{ Body: unknown }>('/api/feedback', async (request, reply) => {
    const parsed = FeedbackRequestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'invalid_request',
        message: 'Please provide imageId, imageUrl, imageAltText, and childDescription.',
      });
    }

    const { imageUrl, imageAltText, childDescription } = parsed.data;

    try {
      const feedback = await ai.getFeedback(imageUrl, imageAltText, childDescription);
      const response: FeedbackResponse = { feedback, cached: false };
      return reply.send(response);
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({
        error: 'feedback_unavailable',
        message: 'We could not get feedback right now. Please try again.',
      });
    }
  });
}
