import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Organisation } from './organisation.entity';
import { Stats } from './stats.embeddable';

@Injectable()
export class OrganisationService {
    private readonly logger = new Logger('OrganisationService');

    constructor(private readonly entityManager: EntityManager) {}

    async setupData() {
        const bookOrgStats = new Stats();
        bookOrgStats.reportedAt = new Date();
        bookOrgStats.numberHeldAtTimeOfReporting = 1234;
        bookOrgStats.asExpected = true;
        bookOrgStats.extraInformation = 'This is some extra information';

        const orderOrgStats = new Stats();
        orderOrgStats.reportedAt = new Date();
        orderOrgStats.numberHeldAtTimeOfReporting = 5678;
        orderOrgStats.asExpected = false;
        orderOrgStats.extraInformation = 'This is some more extra information';

        const org = new Organisation();
        org.name = 'Test Organisation';
        org.bookStats = bookOrgStats;
        org.orderStats = orderOrgStats;

        this.entityManager.persist(org);
        await this.entityManager.flush();
        this.logger.debug('setupData complete');
    }

    async testBug() {
        const foundOrg = await this.entityManager.findOne(Organisation, { name: 'Test Organisation' });

        if (!foundOrg) {
            throw new Error('Organisation not found, run setupData first');
        }

        this.logger.debug('Found organisation');
        //flip the boolean
        foundOrg.someBoolean = !foundOrg.someBoolean;

        this.entityManager.persist(foundOrg);
        await this.entityManager.flush();
        this.logger.debug('testBug complete');
    }
}
