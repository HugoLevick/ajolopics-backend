import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { isEmail, isUUID } from 'class-validator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { AdminUserDto } from './dto/admin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { normalizeUsername } from './username.utils';
import { FindOneUserByOptions, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @OptionalAuth()
  @Get()
  async findAll(@GetUser({ optional: true }) user: User | null) {
    const users = await this.usersService.findAll(user);

    if (user?.role === RolesEnum.ADMIN) {
      return plainToInstance(AdminUserDto, users, {
        excludeExtraneousValues: true,
      });
    }

    return plainToInstance(UserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @OptionalAuth()
  @Get(':term')
  async findOne(
    @Param('term') term: string,
    @GetUser({ optional: true }) requestUser: User | null,
  ) {
    const normalizedTerm = term.trim();
    let payload: FindOneUserByOptions;

    if (isUUID(normalizedTerm)) {
      payload = { id: normalizedTerm };
    } else if (isEmail(normalizedTerm)) {
      payload = { email: normalizedTerm };
    } else {
      payload = { username: normalizeUsername(normalizedTerm) };
    }

    const user = await this.usersService.findOneBy(payload, requestUser);

    return plainToInstance(
      requestUser?.role === RolesEnum.ADMIN ? AuthUserDto : UserDto,
      user,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @ApiBearerAuth()
  @Auth(RolesEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Auth(RolesEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
