import { buildApp } from './app.ts';
import { config } from './config/env.ts';

const app = buildApp(config);

const host = config.HOST;
const port = config.PORT;

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
