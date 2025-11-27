import logger from '@utils/logger';
import { SeederManager } from './seeder.manager';

async function main() {
  try {
    const seederManager = new SeederManager();
    await seederManager.runAll();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();