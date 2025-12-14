import { AppLogger } from '@/common/logger/app.logger';
import { SeederManager } from './seeder.manager';

export const SeederLogger = new AppLogger('Seeder');

async function main() {
  try {
    const seederManager = new SeederManager();

    const specificSeeder = process.argv[2];

    if (specificSeeder) {
      await seederManager.runSpecific(specificSeeder);
    } else {
      await seederManager.runAll();
    }

    process.exit(0);
  } catch (error) {
    SeederLogger.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
