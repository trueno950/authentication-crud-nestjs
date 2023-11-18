import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RoleName } from '../role/enums/roles.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;

      // const requiredRole = this.reflector.get<string>(
      //   'role',
      //   context.getHandler(),
      // );
      // if (requiredRole) {
      //   const userRole: string = payload.role;
      //   if (userRole !== RoleName.Admin && userRole !== requiredRole) {
      //     throw new UnauthorizedException('Insufficient permissions');
      //   }
      // }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
