import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Constants } from '../../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        if (Constants.BY_PASS_URLS.includes(request.url)) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        const request = context.switchToHttp().getRequest();
        request.user = user;
        return user;
    }
}