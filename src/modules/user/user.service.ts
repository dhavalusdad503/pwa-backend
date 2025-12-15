import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);
    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });
  }

  findAll() {
    return this.userRepository.find();
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
