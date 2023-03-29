import { UserService } from '@/modules/user/user.service';
import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    // 传入用户名和密码, 若验证成功, 则返回用户信息, 否则返回 null
    async validateUser(username: string, pwd: string) {
        // 从数据库中查找用户
        const user = await this.userService.getProfileByUuid(username);

        // 验证密码是否正确
        if (user && user.password === pwd) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user; // 去除密码字段
            // 返回用户信息
            return result;
        }
        // 验证失败, 返回 null
        return null;
    }

    // 传入用户信息, 返回 token 字符串
    async login(user: any) {
        return {
            // 基于 payload 生成 token 字符串
            access_token: this.jwtService.sign(user),
        };
    }
}
