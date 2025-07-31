import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PatientRegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SkipAuth } from './decorators/skipauth.decorator';

@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() patientRegisterDto: PatientRegisterDto) {
    return this.authService.register(patientRegisterDto);
  }
}
