import { buildApp } from './app.ts';

const app = buildApp();

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 3000);

try {
  await app.listen({ host, port });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

let isShuttingDown = false;

const shutdown = async (signal: NodeJS.Signals) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  app.log.info({ signal }, 'Signal received, stopping server');

  try {
    await app.close();
    process.exit(0);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', (signal) => {
  void shutdown(signal);
});
process.on('SIGINT', (signal) => {
  void shutdown(signal);
});
