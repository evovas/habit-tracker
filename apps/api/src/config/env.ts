import { envSchema } from 'env-schema';
import { type Static, Type } from 'typebox';

const schema = Type.Object({
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test'),
  ], { default: 'development' }),
  HOST: Type.String({ default: '0.0.0.0' }),
  PORT: Type.Integer({ minimum: 0, maximum: 65535, default: 3000 }),
  CORS_ORIGIN: Type.String({ default: 'http://localhost:5173' }),
});

type ConfigEnv = Static<typeof schema>;

const configEnv = envSchema<ConfigEnv>({
  schema,
});

export const config = {
  ...configEnv,
  CORS_ORIGIN: configEnv.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
} as const;

export type Config = typeof config;
