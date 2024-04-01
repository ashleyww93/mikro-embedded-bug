import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ToolsEntity } from './tools.entity';
import { ToolsResolver } from './tools.resolver';
import { ToolsService } from './tools.service';

@Module({
    imports: [MikroOrmModule.forFeature([ToolsEntity])],
    providers: [ToolsService, ToolsResolver],
    controllers: [],
    exports: [ToolsService],
})
export class ToolsModule {}
