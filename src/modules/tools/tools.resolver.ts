import { Logger } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql/type';
import { ToolsEntity } from './tools.entity';
import { ToolsService } from './tools.service';
import { ulid } from 'ulid';

@Resolver()
export class ToolsResolver {
    private readonly logger = new Logger('ToolsResolver');

    constructor(private readonly toolsService: ToolsService) {}

    @Query(() => [ToolsEntity])
    async testQuery(): Promise<ToolsEntity[]> {
        return this.toolsService.getAll();
    }

    @Mutation(() => [ToolsEntity])
    async testMutation(): Promise<ToolsEntity[]> {
        this.logger.log('testMutation');
        return this.toolsService.testCreateOrUpdate();
    }

    @Mutation(() => GraphQLBoolean)
    async rwTestMikro(): Promise<boolean> {
        return this.toolsService.rwTestMikro();
    }

    @Mutation(() => GraphQLBoolean)
    async rwTestUlid(): Promise<boolean> {
        for (let i = 0; i < 100; i++) {
            ulid();
        }

        return true;
    }

    @Mutation(() => GraphQLBoolean)
    async rwTestConsoleLog(): Promise<boolean> {
        for (let i = 0; i < 5; i++) {
            this.logger.log('I wrote a log!');
        }

        return true;
    }

    @Mutation(() => GraphQLBoolean)
    async rwTestRequest(): Promise<boolean> {
        return true;
    }
}
