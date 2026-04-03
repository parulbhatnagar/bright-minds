import Fastify from 'fastify';
import cors from '@fastify/cors';
import { imagesRoute } from './routes/images.js';
import { feedbackRoute } from './routes/feedback.js';

const PORT = Number(process.env.PORT ?? 3001);

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.WEB_URL ?? false
    : true,
});

app.register(imagesRoute);
app.register(feedbackRoute);

app.get('/health', async () => ({ ok: true }));

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
