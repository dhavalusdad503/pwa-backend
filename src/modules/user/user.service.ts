import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return this.userRepository.update(id);
  // }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
