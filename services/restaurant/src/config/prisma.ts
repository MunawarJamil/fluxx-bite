import { PrismaClient } from '../generated/client/index.js';
import config from './index.js';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.env !== 'production') {
  global.prisma = prisma;
}

export default prisma;
