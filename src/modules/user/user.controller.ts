import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    UseGuards,
    Req,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveBody, UserQuery } from './utils/interfaces';
import { Request } from 'express';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    // 创建用户
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        // 处理 body 的数据格式: 根据身份不同, 添加不同的字段
        // 1. 学生: identity, name, password, college, major, class, (email), (phone)
        // 2. 教师: identity, name, password, college, (email), (phone)
        // 3. 专家: identity, name, password, (email), (phone)
        createUserDto = {
            ...createUserDto,
            password: createUserDto.password,
            name: createUserDto.name,
            registrationTime: `${new Date().getTime()}`,
            email: createUserDto.email || '',
            phone: createUserDto.phone || '',
            identity: +createUserDto.identity,
        };
        if (createUserDto.identity === 2) {
            createUserDto = {
                ...createUserDto,
                college: +createUserDto.college,
            };
        } else if (createUserDto.identity === 1) {
            createUserDto = {
                ...createUserDto,
                college: +createUserDto.college,
                major: +createUserDto.major,
                class: +createUserDto.class,
            };
        }
        return this.userService.create(createUserDto);
    }

    // 获取用户信息
    @Get('identity')
    @UseGuards(AuthGuard('jwt')) // 使用 JWT 鉴权校验用户信息
    getInfo(@Req() request: Request) {
        return request.user;
    }

    // 登录; 下发 token 字符串
    @Post('login')
    @UseGuards(AuthGuard('local')) // 使用 local 策略验证用户信息
    async login(@Req() request: Request) {
        // 返回 token 字符串
        return this.authService.login(request.user);
    }

    // 根据 uuid 获取用户个人信息, 用于登录
    @Get('info')
    getProfileByUuid(@Query('uuid') uuid: string) {
        return this.userService.getProfileByUuid(uuid);
    }

    // 根据 uuid 和 identity 获取用户个人信息, 用于用户信息展示
    @Get('profile/:uuid')
    getProfile(
        @Param('uuid') uuid: string,
        @Query('identity') identity: number,
    ) {
        return this.userService.getProfile(uuid, +identity);
    }

    // 根据 uuid 和 identity 获取用户信息, 用于用户信息修改
    @Get(':uuid')
    findOne(
        @Param('uuid') uuid: string,
        @Query('identity', ParseIntPipe) identity: number,
    ) {
        return this.userService.findOne(uuid, identity);
    }

    // 获取用户列表
    @Get()
    findAll(@Query() userQuery: UserQuery) {
        userQuery = {
            curPage: +userQuery.curPage,
            pageSize: +userQuery.pageSize,
            name: userQuery.name,
            identity: +userQuery.identity,
            uuid: userQuery.uuid,
        };
        return this.userService.findAll(userQuery);
    }

    // 修改用户信息
    @Patch(':uuid')
    update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
        updateUserDto = {
            ...updateUserDto,
            identity: +updateUserDto.identity,
            phone: `${updateUserDto.phone}`,
            class: `${updateUserDto.class}`,
        };
        return this.userService.update(uuid, updateUserDto);
    }

    // 删除用户
    @Delete()
    remove(@Body() body: RemoveBody) {
        return this.userService.remove(body);
    }
}
