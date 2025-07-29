import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/User.schema';
import { CurrentUser } from './decorators/current-user.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { UserRole } from './schemas/User.schema';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Controller('user')
@UseGuards(PoliciesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    if (user.role === UserRole.Admin) {
      return this.userService.findAll();
    } else if (
      user.role === UserRole.DepartmentManager &&
      'departmentId' in user &&
      user.departmentId
    ) {
      return this.userService.findAll({
        departmentId: String((user as any).departmentId),
      });
    } else {
      return { message: 'Not Authorized' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const ability = this.caslAbilityFactory.defineAbility(user);
    const targetUser = await this.userService.findOne(id);
    if (!targetUser || !ability.can('read', targetUser)) {
      return { message: 'Not Authorized' };
    }
    return targetUser;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    const ability = this.caslAbilityFactory.defineAbility(user);
    const targetUser = await this.userService.findOne(id);
    if (!targetUser || !ability.can('update', targetUser)) {
      return { message: 'Not Authorized' };
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const ability = this.caslAbilityFactory.defineAbility(user);
    const targetUser = await this.userService.findOne(id);
    if (!targetUser) {
      return { message: 'User not found' };
    }
    if (!ability.can('delete', targetUser)) {
      return { message: 'Forbidden' };
    }
    return this.userService.remove(id);
  }
}
