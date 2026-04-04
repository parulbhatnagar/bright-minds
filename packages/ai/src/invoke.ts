import { initChatModel } from 'langchain/chat_models/universal';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { ZodSchema } from 'zod';

/** Generic structured AI invocation — use for any module that needs a custom prompt + schema. */
export async function invokeStructured<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: ZodSchema<T>,
): Promise<T> {
  const model = await initChatModel(process.env.AI_MODEL, {
    modelProvider: process.env.AI_PROVIDER ?? 'openai',
    temperature: 0.7,
    maxTokens: 512,
  });

  const structured = model.withStructuredOutput(schema);
  const result = await structured.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  return result as T;
}
