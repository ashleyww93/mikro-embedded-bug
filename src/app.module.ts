import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from './modules/graphql/graphql.module';
import { MikroORM } from '@mikro-orm/core';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { DatabaseModule } from './modules/database/database.module';
import { ToolsModule } from './modules/tools/tools.module';
import { ExtendedLogger } from './utils/ExtendedLogger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CLS_ID, ClsModule, ClsService } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';

const RequestIdHeader = 'X-Request-Id';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
                generateId: false,
                setup: (clsService: ClsService, req: FastifyRequest['raw'], res: FastifyReply['raw']) => {
                    clsService.set(CLS_ID, req.id);
                    res.setHeader(RequestIdHeader, clsService.getId());
                },
            },
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'debug',
                autoLogging: false,
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        singleLine: true,
                        levelFirst: false,
                        translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
                        messageFormat: `{if req.id}({req.id}){end} {if context}[{context}]{end} {msg}`,
                    },
                },
            },
        }),
        ConfigurationModule,
        DatabaseModule.register(),
        GraphQLModule.register(),
        ToolsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements OnModuleInit {
    private readonly logger = new ExtendedLogger('AppModule');
    constructor(private readonly orm: MikroORM) {}

    async onModuleInit(): Promise<void> {
        this.logger.log(`Running MikroOrm Migrator`);
        await this.orm.getMigrator().up();
    }
}
