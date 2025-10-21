import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({message: "El email es requerido"})
    @IsEmail()
    email: string;

    @IsNotEmpty({message: "La contraseña es requerido"})
    @IsString({message: "La contraseña debe ser una cadena de texto"})
    password: string;
}