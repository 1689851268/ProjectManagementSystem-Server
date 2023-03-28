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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveBody, UserQuery } from './utils/interfaces';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post() // 创建用户
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

    @Get() // 获取用户列表
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

    @Get(':uuid') // 获取用户信息, 用于用户信息修改
    findOne(
        @Param('uuid') uuid: string,
        @Query('identity', ParseIntPipe) identity: number,
    ) {
        return this.userService.findOne(uuid, identity);
    }

    @Patch(':uuid') // 修改用户信息
    update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
        updateUserDto = {
            ...updateUserDto,
            identity: +updateUserDto.identity,
            phone: `${updateUserDto.phone}`,
            class: `${updateUserDto.class}`,
        };
        return this.userService.update(uuid, updateUserDto);
    }

    @Delete() // 删除用户
    remove(@Body() body: RemoveBody) {
        return this.userService.remove(body);
    }

    @Get('profile/:uuid') // 获取用户个人信息
    getProfile(
        @Param('uuid') uuid: string,
        @Query('identity') identity: number,
    ) {
        return this.userService.getProfile(uuid, +identity);
    }
}
