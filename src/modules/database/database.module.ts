import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoadStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { databaseSchema } from '../configuration/schemas/database.schema';
import { AuditLogSubscriber } from './audit/audit.log.subscriber';
import { buildDatabaseConfig } from './mikro-orm.config';
import { ClsService } from 'nestjs-cls';

@Module({})
export class DatabaseModule {
    static register(): DynamicModule {
        const mikroORM = MikroOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService<typeof databaseSchema>, ClsService],
            useFactory: (configService: ConfigService<typeof databaseSchema>, clsService: ClsService) => {
                return {
                    ...buildDatabaseConfig(
                        configService.get<boolean>('DATABASE_DEBUG_LOGGING'),
                        configService.get<string>('DATABASE_HOST'),
                        configService.get<number>('DATABASE_PORT'),
                        configService.get<string>('DATABASE_USERNAME'),
                        configService.get<string>('DATABASE_PASSWORD'),
                        configService.get<string>('DATABASE_SCHEMA'),
                        configService.get<boolean>('DATABASE_SSL'),
                        configService.get<number>('DATABASE_POOLSIZE'),
                        configService.get<number>('DATABASE_IDLE_TIMEOUT'),
                    ),
                    autoLoadEntities: true,
                    extensions: [Migrator],
                    loadStrategy: LoadStrategy.SELECT_IN,
                    subscribers: [new AuditLogSubscriber(clsService)],
                };
            },
        });

        return {
            module: DatabaseModule,
            imports: [mikroORM],
            providers: [],
            exports: [mikroORM],
        };
    }
}
