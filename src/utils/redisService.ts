import { ENV_CONFIG } from "@config/envConfig";
import logger from "@utils/logger";
import Redis, { Redis as RedisType } from "ioredis";

class RedisService {
  private static instance: RedisType | null = null;

  // Initialize Redis client
  public static init(): RedisType {
    if (RedisService.instance) return RedisService.instance;

    RedisService.instance = new Redis({
      host: ENV_CONFIG.REDIS_CONFIG.HOST,
      port: ENV_CONFIG.REDIS_CONFIG.PORT,
      // username: ENV_CONFIG.REDIS_CONFIG.USER,
      // password: ENV_CONFIG.REDIS_CONFIG.PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      reconnectOnError: (err) => {
        const targetErrors = ["ECONNREFUSED", "NR_CLOSED"];
        return targetErrors.some((e) => err.message.includes(e));
      },
    });

    // Event listeners
    RedisService.instance.on("connect", () => logger.info("Redis Connected ✔"));
    RedisService.instance.on("ready", () => logger.info("Redis Ready 🚀"));
    RedisService.instance.on("error", (err) =>
      logger.error("Redis Error ❌", err)
    );
    RedisService.instance.on("close", () =>
      logger.warn("Redis Disconnected ❌")
    );
    RedisService.instance.on("reconnecting", (delay: number) =>
      logger.info(`Redis reconnecting in ${delay}ms...`)
    );

    return RedisService.instance;
  }

  // Explicitly connect (useful on server start)
  public static async connect(): Promise<void> {
    const client = RedisService.init();

    if (client.status === "end") {
      try {
        await client.connect();
        logger.info("✅ Redis connection established successfully.");
      } catch (error) {
        logger.error("❌ Redis connection failed:", error);
        process.exit(1);
      }
    } else {
      logger.info(`Redis is already ${client.status}, skipping connect.`);
    }
  }

  // Access client anywhere
  public static getClient(): RedisType {
    if (!RedisService.instance) {
      throw new Error("Redis not initialized. Call RedisService.init() first.");
    }
    return RedisService.instance;
  }
}

export default RedisService;
