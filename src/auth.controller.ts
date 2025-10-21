import { Controller} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: "user_register"})
  async register(data: CreateUserDto) {
    return await this.authService.register(data);
  }

  @MessagePattern({cmd: "user_login"})
  async login(data: LoginDto) {
    return await this.authService.login(data);
  }
}
