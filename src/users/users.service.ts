import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RolesEnum } from 'src/auth/enums/roles.enum';

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

  // Could use pagination if the number of users grows significantly, but for this demo it's not necessary
  async findAll(requestingUser?: User) {
    if (requestingUser?.role === RolesEnum.ADMIN) {
      return this.usersRepository.find();
    }

    return this.usersRepository.find({
      select: {
        id: true,
        name: true,
        role: true,
      },
      where: {
        role: RolesEnum.CREATOR,
      },
    });
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
