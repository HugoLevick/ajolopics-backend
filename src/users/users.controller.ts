import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { AdminUserDto } from './dto/admin-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

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
  @Auth(RolesEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneBy({ id });
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
