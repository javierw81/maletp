import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtPayload } from './jwtPayload';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor (private jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    try { 

    const request = context.switchToHttp().getRequest<Request>(); 

    const token = this.extractTokenFromCookie(request); 

    if (!token) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    const payload: jwtPayload = await this.jwtService.verifyAsync( 
      token, 
      {
        secret: process.env.JWT_SECRET
      }
    ); 

    request['user'] = payload; 

    return true;

    } catch (error) {

      if (error instanceof UnauthorizedException) throw error;

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado. Por favor, inicie sesión nuevamente.');
      }

      if ( error instanceof JsonWebTokenError) {
       throw new UnauthorizedException('La firma del token falló o token modificado');
      }

      console.error('Error en verificar token:', error);
      throw new InternalServerErrorException('Ocurrió un error al verificar el token.');

    }
  }

  extractTokenFromCookie(request: Request): string | undefined {

    return request.cookies?.access_token; 

  }
}
