import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected readonly configService: ConfigService) {
        super({
            // 从请求头的 Authorization 中获取 token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 不忽略过期时间, 即 token 过期后无法使用, 需要重新登录, 获取新的 token
            ignoreExpiration: false,
            // 用于验证 token 的密钥
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    // 重写 validate 方法, 获取 token 中的数据, 用于验证用户
    // token 验证通过后会调用该方法, token 中的数据会作为参数传入
    async validate(payload: any) {
        // 返回用户信息, 会被保存到 req.user 中
        return {
            uuid: payload.uuid,
            identity: payload.identity,
            id: payload.id,
        };
    }
}
