import Fastify from 'fastify';
import cors from '@fastify/cors';
import { imagesRoute } from './routes/images.js';
import { feedbackRoute } from './routes/feedback.js';
import { sessionsRoute } from './routes/sessions.js';
import { wordWorldRoute } from './routes/modules/wordWorld.js';
import { emotionMirrorRoute } from './routes/modules/emotionMirror.js';
import { myDayJournalRoute } from './routes/modules/myDayJournal.js';
import { mathStoriesRoute } from './routes/modules/mathStories.js';
import { wordJarRoute } from './routes/wordJar.js';

const PORT = Number(process.env.PORT ?? 3001);

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.WEB_URL ?? false
    : true,
});

app.register(imagesRoute);
app.register(feedbackRoute);
app.register(sessionsRoute);
app.register(wordWorldRoute);
app.register(emotionMirrorRoute);
app.register(myDayJournalRoute);
app.register(mathStoriesRoute);
app.register(wordJarRoute);

app.get('/health', async () => ({ ok: true }));

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
