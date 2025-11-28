import bcrypt from 'bcrypt';
import logger from '@utils/logger';
import { AuthProvider, Roles, UserStatus } from '@enums';
import { UserRepository } from '@features/user';
import { RoleRepository } from '@features/roles';

export class UserSeeder {

  private userRepository: typeof UserRepository;
  private roleRepository: typeof RoleRepository;

  constructor() {
    this.userRepository = UserRepository;
    this.roleRepository = RoleRepository;
  }

  async run(): Promise<void> {
    try {
      logger.info("Seeding users...");

      if (await this.userRepository.dataExists()) {
        logger.warn('Users already exist, skipping...');
        return;
      }

      const roles = await this.roleRepository.findAll();
      const adminRole = roles.find(role => role.name === Roles.ADMIN);
      const supervisorRole = roles.find(role => role.name === Roles.SUPERVISOR);
      const caregiverRole = roles.find(role => role.name === Roles.CAREGIVER);

      if (!adminRole || !supervisorRole || !caregiverRole) {
        logger.error('Roles not found, skipping users seeding...');
        return;
      }

      const users = [
        {
          firstName: "Admin1",
          lastName: "Admin1",
          email: "admin1@yopmail.com",
          roleId: adminRole?.id,
          status: UserStatus.ACTIVE,
          authProvider: AuthProvider.EMAIL,
          password: await bcrypt.hash("admin@123", 10),
        },
        {
          firstName: "User1",
          lastName: "User1",
          email: "user1@yopmail.com",
          roleId: caregiverRole?.id,
          status: UserStatus.ACTIVE,
          authProvider: AuthProvider.EMAIL,
          password: await bcrypt.hash("user@123", 10),
        },
        {
          firstName: "SuperVisor1",
          lastName: "SuperVisor1",
          email: "SuperVisor1@yopmail.com",
          roleId: supervisorRole?.id,
          status: UserStatus.ACTIVE,
          authProvider: AuthProvider.EMAIL,
          password: await bcrypt.hash("supervisor@123", 10),
        },
      ];

      await this.userRepository.bulkCreate(users);
      logger.info('Users seeded successfully!');
    } catch (error) {
      logger.error("Error seeding users:", error);
      throw error;
    }
  }
}
