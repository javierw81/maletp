import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findOne(@Query('nombreUsuario') nombreUsuario:  string) {
    return this.userService.searchByUsername(nombreUsuario);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // guard para proteger rutas solo admin
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  } 

    /* 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  } 
  */
}
