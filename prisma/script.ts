import prisma from '../services/prisma';
import { migrate } from './migrations';

(async () => {
  migrate(prisma);
})();
