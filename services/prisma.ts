import { PrismaClient } from '@prisma/client';
import { fieldEncryptionMiddleware } from 'prisma-field-encryption';

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (!global.prisma) {
  prisma.$use(fieldEncryptionMiddleware());
  global.prisma = prisma;
}

export default prisma;
