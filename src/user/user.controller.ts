import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@CurrentUser() user: Record<string, any>) {
    return this.userService.findAllWithAuth(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: Record<string, any>,
  ) {
    return this.userService.findOneWithAuth(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: Record<string, any>,
  ) {
    return this.userService.updateWithAuth(id, updateUserDto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: Record<string, any>,
  ) {
    return this.userService.removeWithAuth(id, user);
  }
}
