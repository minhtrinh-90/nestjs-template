import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
    credentials: true,
  },
  swagger: {
    enabled: true,
    title: 'NestJS Template',
    description: 'My NestJS starter template APIs',
    version: '1.0.0',
    path: 'docs',
  },
  security: {
    expiresIn: '1h',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  cookie: {
    httpOnly: true,
    sameSite: true,
    secure: true,
    signed: true,
  },
};

export default (): Config => config;
