import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOneOptions, ILike, Repository } from 'typeorm';
import { AuthTokenPayload, CommonPaginationOptionType } from '@common/types';
import { QueryBuilderService } from '@common/utils/queryBuilder/queryBuilder.service';
import usersFieldsMap from './dto/userFieldMap';
import { Roles } from '@common/constants';
import { Role } from '@modules/roles/entities/role.entity';
import { OrgUser } from '@modules/org-user/entities/org-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(OrgUser)
    private readonly userOrgRepository: Repository<OrgUser>,
    private readonly queryBuilderService: QueryBuilderService,
  ) { }

  async create(createUserDto: CreateUserDto, userInfo: AuthTokenPayload) {

    const { org_id } = userInfo;

    if (!org_id) {
      throw new Error('Organization not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const { role: roleSlug, ...rest } = createUserDto;

    const role = await this.roleRepository.findOne({
      where: { slug: roleSlug },
    });

    const roleId = role?.id;

    if (!roleId) {
      throw new Error('Role not found');
    }


    const newUser = {
      ...rest,
      roleId,
    };

    const user = await this.userRepository.save(newUser);

    await this.userOrgRepository.save({
      orgId: org_id,
      userId: user.id,
    })

    return this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email', 'phone'],
      where: { email: createUserDto.email },
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

    const columnsToSelect = Array.from(new Set([...defaultColumns, ...(params.column ? params.column : [])]));


    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.userOrgs', 'userOrg')
      .where('userOrg.orgId = :orgId', { orgId: org_id })
      .andWhere('role.slug = :userType', { userType: params.userType?.toUpperCase() })
      .select([
        ...columnsToSelect.map((column) => `user.${column}`),
        'role.slug',
        'role.id',
        'userOrg.orgId',
      ])
      .skip(skip)
      .take(limit);

    if (params.search) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb.where('user.firstName ILIKE :search', { search: `%${params.search}%` })
          .orWhere('user.lastName ILIKE :search', { search: `%${params.search}%` })
          .orWhere('user.email ILIKE :search', { search: `%${params.search}%` })
          .orWhere('user.phone ILIKE :search', { search: `%${params.search}%` });
      }))
    }

    if(params.sortColumn && params.sortOrder) {
      queryBuilder.orderBy(`user.${params.sortColumn}`, params.sortOrder === 'asc' ? 'ASC' : 'DESC');
    }

    const [rows, count] = await queryBuilder.getManyAndCount();

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
