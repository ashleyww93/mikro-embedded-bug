import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { Logger } from 'nestjs-pino';
import { ulid } from 'ulid';

export let app: NestFastifyApplication | undefined = undefined;

async function bootstrap() {
    Error.stackTraceLimit = 1000;
    app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            genReqId: () => {
                return ulid();
            },
        }),
    );

    app = app!;

    const logger = app.get(Logger);
    app.useLogger(logger);
    app.enableCors();
    app.enableShutdownHooks();

    const orm = app.get(MikroORM);

    // app.use(bodyParser.json({ limit: '5mb' }));
    // app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

    const port = process.env.PORT || 3123;
    const host = process.env.HOST || `http://localhost:${port}`;
    await app.listen(port);

    logger.log(`🚀 Application is running on: ${host}`);
    logger.verbose(`Startup ULID: ${ulid()}`);
}
bootstrap();
