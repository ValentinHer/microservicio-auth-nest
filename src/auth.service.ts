import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom, retry } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@Inject("USER_SERVICE") private client: ClientProxy){}

  async register(data: CreateUserDto) {
    try {
      const result = await firstValueFrom(this.client.send({cmd: "create_user"}, data));
      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async login(data: LoginDto) {
    // const salt = await bcrypt.genSalt(10);

    try {
      const user = await firstValueFrom(this.client.send({cmd: "get_user_by_email"}, data.email));
      const isMatch = await bcrypt.compare(data.password, user.password);

      if(!isMatch) throw new RpcException({success: false, message: "Verifique sus credenciales"});

      return {success: true, message: "Usuario logueado exitosamente"};
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
