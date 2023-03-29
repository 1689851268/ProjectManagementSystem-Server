import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable() // 通过 PassportStrategy 使用 local 策略
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    // 重写 validate 方法, 用于验证用户
    // 会获取到请求体中的参数, 作为参数传入
    async validate(username: string, password: string) {
        // 调用 authService 中的 validateUser 方法验证用户
        const user = await this.authService.validateUser(username, password);

        // 验证失败, 抛出 '未授权' 错误 (401)
        if (!user) {
            throw new UnauthorizedException('用户名或密码错误');
        }
        // 返回用户信息, 会被保存到 req.user 中
        return user;
    }
}
