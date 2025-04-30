import { isObservable, lastValueFrom } from 'rxjs';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const result = super.canActivate(context);

    // Check if it's an Observable and convert it to Promise
    if (isObservable(result)) {
      return await lastValueFrom(result);
    }

    // Already a boolean or Promise<boolean>
    return await result;
  }
}
