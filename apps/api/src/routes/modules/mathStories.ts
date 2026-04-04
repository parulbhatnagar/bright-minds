import type { FastifyInstance } from 'fastify';
import { invokeStructured, mathStoriesGeneratePrompt, mathStoriesFeedbackPrompt } from '@study-aid/ai';
import {
  DifficultyLevelSchema,
  MathFeedbackRequestSchema,
  MathProblemSchema,
  MathFeedbackResultSchema,
} from '@study-aid/types';
import type { MathProblem, MathFeedbackResult } from '@study-aid/types';
import { z } from 'zod';

const GenerateRequestSchema = z.object({
  difficultyLevel: DifficultyLevelSchema,
});

// Internal schema includes correctAnswer — never sent to client
const MathProblemWithAnswerSchema = MathProblemSchema.extend({ correctAnswer: z.number() });

export async function mathStoriesRoute(app: FastifyInstance) {
  app.post<{ Body: unknown }>('/api/modules/math-stories/generate', async (request, reply) => {
    const parsed = GenerateRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    try {
      const full = await invokeStructured<MathProblem & { correctAnswer: number }>(
        mathStoriesGeneratePrompt(parsed.data.difficultyLevel),
        `Generate a ${parsed.data.difficultyLevel} difficulty maths word problem.`,
        MathProblemWithAnswerSchema,
      );

      // Store answer server-side: return a signed token (simple approach: base64 for Phase 1)
      const answerToken = Buffer.from(String(full.correctAnswer)).toString('base64');

      return reply.send({
        problem: full.problem,
        context: full.context,
        difficultyLevel: full.difficultyLevel,
        answerToken,
      });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'generation_unavailable', message: 'Please try again.' });
    }
  });

  app.post<{ Body: unknown }>('/api/modules/math-stories/feedback', async (request, reply) => {
    const parsed = MathFeedbackRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'invalid_request' });
    }

    const { problem, correctAnswer, childAnswer, childExplanation, difficultyLevel } = parsed.data;

    try {
      const isCorrect = childAnswer === correctAnswer;
      const userPrompt = `Math problem: "${problem}"
Correct answer: ${correctAnswer}
Child's answer: ${childAnswer} (${isCorrect ? 'correct!' : 'different from expected'})
${childExplanation ? `Child's explanation: "${childExplanation}"` : ''}
${isCorrect ? 'Celebrate their correct answer enthusiastically!' : "Respond warmly — never say wrong. Walk through the solution gently step by step."}`;

      const feedback = await invokeStructured<MathFeedbackResult>(
        mathStoriesFeedbackPrompt(difficultyLevel),
        userPrompt,
        MathFeedbackResultSchema,
      );

      return reply.send({ feedback: { ...feedback, isCorrect } });
    } catch (err) {
      app.log.error(err);
      return reply.status(503).send({ error: 'feedback_unavailable', message: 'Please try again.' });
    }
  });
}
