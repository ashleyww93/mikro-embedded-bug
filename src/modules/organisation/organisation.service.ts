import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { OrganisationMetadata } from './metadata/organisation.metadata.entity';
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

        const metadataOne = new OrganisationMetadata();
        metadataOne.key = 'key1';
        metadataOne.value = 'value1';

        const metadataTwo = new OrganisationMetadata();
        metadataTwo.key = 'key2';
        metadataTwo.value = 'value2';

        const org = new Organisation();
        org.name = 'Test Organisation';
        org.bookStats = bookOrgStats;
        org.orderStats = orderOrgStats;
        org.metadata.add(metadataOne, metadataTwo);

        this.entityManager.persist(org);
        await this.entityManager.flush();
        this.logger.debug('setupData complete');
    }

    async testBug() {
        const foundOrg = await this.entityManager.findOne(
            Organisation,
            { name: 'Test Organisation' },
            { populate: ['metadata'] },
        );

        if (!foundOrg) {
            throw new Error('Organisation not found, run setupData first');
        }

        this.logger.debug('Found organisation');
        //flip the boolean
        foundOrg.someBoolean = !foundOrg.someBoolean;

        //now loop over the metadata and set the values
        const mappedMetadata: OrganisationMetadata[] = [];
        const existingMetadataOne = await this.entityManager.findOne(OrganisationMetadata, { key: 'key1' });
        if (existingMetadataOne) {
            //set the same value, as if it came from an API call
            existingMetadataOne.value = 'value1';
            mappedMetadata.push(existingMetadataOne);
        }

        const existingMetadataTwo = await this.entityManager.findOne(OrganisationMetadata, { key: 'key2' });
        if (existingMetadataTwo) {
            //set the same value, as if it came from an API call
            existingMetadataTwo.value = 'value2';
            mappedMetadata.push(existingMetadataTwo);
        }

        if (!foundOrg.metadata.isInitialized()) {
            await foundOrg.metadata.init();
        }
        foundOrg.metadata.set(mappedMetadata);

        this.entityManager.persist(foundOrg);
        await this.entityManager.flush();
        this.logger.debug('testBug complete');
    }
}
