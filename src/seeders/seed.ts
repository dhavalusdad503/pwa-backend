import logger from "@utils/logger";
import { SeederManager } from "./seeder.manager";

import { initModels } from "../models";

async function main() {
  try {
    // Initialize models before seeding
    initModels();

    const seederManager = new SeederManager();

    const specificSeeder = process.argv[2];

    if (specificSeeder) {
      await seederManager.runSpecific(specificSeeder);
    } else {
      await seederManager.runAll();
    }

    process.exit(0);
  } catch (error) {
    logger.error("Seeding failed:", error);
    process.exit(1);
  }
}

main();
