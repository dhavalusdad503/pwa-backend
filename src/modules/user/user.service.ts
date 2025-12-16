import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { AuthTokenPayload, CommonPaginationOptionType } from '@common/types';
import { QueryBuilderService } from '@common/utils/queryBuilder/queryBuilder.service';
import usersFieldsMap from './dto/userFieldMap';
import { Roles } from '@common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);
    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });
  }

  async findAll(
    user: AuthTokenPayload,
    params: CommonPaginationOptionType & {
      userType?: string;
      column?: string | string[];
    },
  ) {
    const { org_id, role } = user;
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    if (
      role === Roles.SUPERVISOR &&
      [Roles.SUPERVISOR, Roles.ADMIN].includes(
        params.userType?.toUpperCase() as Roles,
      )
    ) {
      params.userType = Roles.CAREGIVER;
    }

    const defaultColumns = [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'createdAt',
      'updatedAt',
    ];
    const queryBuilder = this.queryBuilderService.buildQuery(
      usersFieldsMap,
      defaultColumns,
      params.column,
      {
        where: {
          userOrgs: { orgId: org_id },
          role: { name: params.userType?.toUpperCase() },
        },
        skip,
        take: limit,
      },
    );

    const [rows, count] = await this.userRepository.findAndCount(queryBuilder);

    return { rows, count };
  }

  findOne(id: string, options?: FindOneOptions<User>) {
    return this.userRepository.findOne({ where: { id }, ...options });
  }

  findUserByEmail(email: string, options?: FindOneOptions<User>) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
      ...options,
    });
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.update(id, data);
  }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return this.userRepository.update(id);
  // }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
