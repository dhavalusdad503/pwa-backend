import { SeederManager } from './seeder.manager';

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
    console.log('Seeding failed:', error);
    process.exit(1);
  }
}

main();
