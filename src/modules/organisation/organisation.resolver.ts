import { Logger } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql/type';
import { Organisation } from './organisation.entity';
import { OrganisationService } from './organisation.service';

@Resolver(() => Organisation)
export class OrganisationResolver {
    private readonly logger = new Logger('OrganisationResolver');
    constructor(private readonly organisationService: OrganisationService) {}

    @Mutation(() => GraphQLBoolean, {
        name: 'setupData',
    })
    async setupData() {
        //
        this.logger.debug('setupData called');
        await this.organisationService.setupData();
        return true;
    }

    @Mutation(() => GraphQLBoolean, {
        name: 'testBug',
    })
    async testBug() {
        //
        this.logger.debug('testBug called');
        await this.organisationService.testBug();
        return true;
    }
}
