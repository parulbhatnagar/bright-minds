import { initChatModel } from 'langchain/chat_models/universal';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { FeedbackResultSchema } from '@bright-minds/types';
import type { AIProvider } from '../types.js';
import type { FeedbackResult } from '@bright-minds/types';

const SYSTEM_PROMPT = `You are a friendly, encouraging teacher helping a child improve their speech and expression.

Rules:
- Always start with genuine appreciation for what the child noticed or described
- Never use the word "wrong", "missing", "forgot", "incorrect", or any discouraging language
- Frame suggestions as additions, not corrections: "You could also mention..."
- Keep all sentences short and simple — the child is aged 8 to 16
- Suggest only 1 to 2 improvements at most
- Include one example of a slightly improved sentence
- Choose one vocabulary word from the image that is one level above the child's current usage; give a simple, joyful definition`;

function buildUserPrompt(imageContext: string, childDescription: string): string {
  return `The child looked at the image above and wrote: "${childDescription}"

Additional image context: ${imageContext}

Respond with structured feedback. The suggestions array must contain at most 2 items. The vocabulary word definition must be simple enough for a child aged 8-16 to understand.`;
}

export class LangChainProvider implements AIProvider {
  async getFeedback(
    imageUrl: string,
    imageContext: string,
    childDescription: string
  ): Promise<FeedbackResult> {
    const model = await initChatModel(process.env.AI_MODEL, {
      modelProvider: process.env.AI_PROVIDER ?? 'openai',
      temperature: 0.7,
      maxTokens: 512,
    });

    const structured = model.withStructuredOutput(FeedbackResultSchema);

    const result = await structured.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage({
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'low' },
          },
          {
            type: 'text',
            text: buildUserPrompt(imageContext, childDescription),
          },
        ],
      }),
    ]);

    return result as FeedbackResult;
  }
}
