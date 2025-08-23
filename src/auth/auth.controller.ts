import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PatientRegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SkipAuth } from './decorators/skipauth.decorator';

@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() patientRegisterDto: PatientRegisterDto) {
    return this.authService.register(patientRegisterDto);
  }

  @Get('/me')
  async me(@Req() req: any) {
    const user = await this.authService.getMe(req.user.sub);
    return {
      success: true,
      message: 'User fetched successfully',
      data: { user }
    }
  }
}
