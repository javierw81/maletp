import { IsNotEmpty, IsString } from "class-validator";

export class loginDTO {

    @IsNotEmpty({ message: "Debe ingresar un nombre de usuario o correo." })
    @IsString({ message: "El usuario o correo debe ser una cadena de texto." })
    identificador: string;

    @IsNotEmpty({ message: "Debe ingresar una contraseña." })
    @IsString({ message: "La contraseña debe ser una cadena de texto." })
    password: string;
  
}
