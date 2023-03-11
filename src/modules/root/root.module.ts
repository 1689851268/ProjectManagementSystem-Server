import { Module } from '@nestjs/common';
import { RootService } from './root.service';
import { RootController } from './root.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Root } from 'src/entities/Root';

@Module({
    imports: [TypeOrmModule.forFeature([Root])],
    controllers: [RootController],
    providers: [RootService],
})
export class RootModule {}
