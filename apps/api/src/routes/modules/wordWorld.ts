import type { FastifyInstance } from 'fastify';
import { invokeStructured, wordWorldSystemPrompt } from '@study-aid/ai';
import {
  WordWorldFeedbackRequestSchema,
  FeedbackResultSchema,
} from '@study-aid/types';
import type { FeedbackResult } from '@study-aid/types';
import { createServiceClient, addWord } from '@study-aid/db';

export async function wordWorldRoute(app: FastifyInstance) {
  app.post<{ Body: unknown }>('/api/modules/word-world/feedback', async (request, reply) => {
    const parsed = WordWorldFeedbackRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    const { word, definition, childSentence, childId, difficultyLevel } = parsed.data;

    try {
      const userPrompt = `The vocabulary word is: "${word}" (meaning: ${definition})
The child wrote this sentence using the word: "${childSentence}"
Please respond with encouragement and optional expansion. Never rewrite their sentence.`;

      const feedback = await invokeStructured<FeedbackResult>(
        wordWorldSystemPrompt(difficultyLevel),
        userPrompt,
        FeedbackResultSchema,
      );

      // Save word to Word Jar — non-blocking
      const supabase = createServiceClient();
      addWord(supabase, {
        childId,
        word,
        definition,
        childSentence,
        sourceModule: 'word-world',
      }).catch((err: unknown) => app.log.error(err));

      return reply.send({ feedback, cached: false });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'feedback_unavailable', message: 'Please try again.' });
    }
  });
}
