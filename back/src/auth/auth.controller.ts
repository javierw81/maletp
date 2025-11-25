import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from 'src/user/users.service';
import type  { Request, Response } from 'express';
import { UserDecorator } from 'src/decorators/user/user';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login") 
  login(@Body() body: loginDTO, @Res({ passthrough: true }) res: Response ) {
    return this.authService.login(body, res); 
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('perfilImagen'))
  @Post("registro") 
  register(@Body() body: RegisterDto, @UploadedFile(new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
        ]
      })) file: Express.Multer.File) {


    return this.authService.register(body, file); 
  }

  @UseGuards(AuthGuard)
  @Get('perfil')
  async getProfile(@UserDecorator('sub') userId: string) {
    return await this.userService.findById(userId);
  }

  @UseGuards(AuthGuard)
  @Post('autorizar')
  autorizar(@Req() req: Request) {
    return this.authService.autorizar(req);
  }

  @UseGuards(AuthGuard)
  @Post('refrescar')
  refrescar(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refrescar(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res); 
  }
}
