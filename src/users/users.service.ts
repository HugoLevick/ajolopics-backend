import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { In, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserErrorDefinitions } from './error-definitions';

export interface FindOneUserByOptions {
  email?: string;
  id?: string;
  username?: string;
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
      where: {
        role: In([RolesEnum.CREATOR, RolesEnum.ADMIN]), //TODO: show only creators with posts
      },
    });
  }

  async findOneBy(options: FindOneUserByOptions, requestUser?: User) {
    let user: User;
    const canSearchByEmail =
      requestUser && requestUser.role === RolesEnum.ADMIN;

    if (options.email && canSearchByEmail) {
      user = await this.usersRepository.findOne({
        where: { email: options.email },
      });
    }

    if (options.username) {
      user = await this.usersRepository.findOne({
        where: { username: options.username },
      });
    }

    if (options.id) {
      user = await this.usersRepository.findOne({ where: { id: options.id } });
    }

    if (!user) {
      throw UserErrorDefinitions.USER_NOT_FOUND.build(404);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    throw new InternalServerErrorException('Method not implemented.');
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
