import type { FastifyInstance } from 'fastify';
import { invokeStructured, emotionMirrorSystemPrompt } from '@study-aid/ai';
import {
  EmotionMirrorFeedbackRequestSchema,
  EmotionMirrorFeedbackResultSchema,
} from '@study-aid/types';
import type { EmotionMirrorFeedbackResult } from '@study-aid/types';

export async function emotionMirrorRoute(app: FastifyInstance) {
  app.post<{ Body: unknown }>('/api/modules/emotion-mirror/feedback', async (request, reply) => {
    const parsed = EmotionMirrorFeedbackRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    const { imageAltText, selectedEmotion, childReasoning, difficultyLevel } = parsed.data;

    try {
      const userPrompt = `The image shows: "${imageAltText}"
The child identified the emotion as: "${selectedEmotion}"
${childReasoning ? `The child's reasoning: "${childReasoning}"` : ''}
Please validate their answer warmly — there is no single correct emotion. Expand on their choice.`;

      const feedback = await invokeStructured<EmotionMirrorFeedbackResult>(
        emotionMirrorSystemPrompt(difficultyLevel),
        userPrompt,
        EmotionMirrorFeedbackResultSchema,
      );

      return reply.send({ feedback, cached: false });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'feedback_unavailable', message: 'Please try again.' });
    }
  });
}
