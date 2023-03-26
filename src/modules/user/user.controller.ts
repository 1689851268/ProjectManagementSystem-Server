import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveBody, UserQuery } from './utils/interfaces';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

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
        console.log(createUserDto);
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

    @Get(':uuid')
    findOne(@Param('uuid') uuid: string, @Query('identity') identity: number) {
        return this.userService.findOne(uuid, +identity);
    }

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

    @Delete()
    remove(@Body() body: RemoveBody) {
        return this.userService.remove(body);
    }
}
