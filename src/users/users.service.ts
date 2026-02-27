import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

interface FindOneOptions {
  email?: string;
  id?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: RegisterUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.insert(user);
    return user;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOneBy(options: FindOneOptions) {
    if (options.email) {
      return this.usersRepository.findOne({ where: { email: options.email } });
    }

    return this.usersRepository.findOne({ where: { id: options.id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    throw new InternalServerErrorException('Method not implemented.');
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
