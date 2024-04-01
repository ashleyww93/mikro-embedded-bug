import { Logger } from '@nestjs/common';
import { EventSubscriber, FlushEventArgs } from '@mikro-orm/core';
import { AuditContext } from './audit.context';
import { AuditLogType } from './audit.log.type';
import { ClsService } from 'nestjs-cls';

export class AuditLogSubscriber implements EventSubscriber {
    private readonly logger = new Logger('AuditLogSubscriber');

    constructor(private readonly cls: ClsService) {}

    blacklistedAuditLogTypes: string[] = ['NobleTask'];

    async afterFlush(args: FlushEventArgs): Promise<void> {
        const rId = this.cls.getId();
        const auditContext = this.cls.get<AuditContext | undefined>('auditContext') ?? AuditContext.DEFAULT;

        const computedChanges: AuditLogType[] = [];
        const changeSets = args.uow.getChangeSets();
        for (const changeSet of changeSets) {
            if (this.blacklistedAuditLogTypes.includes(changeSet.name)) {
                continue;
            }

            const computedChange: AuditLogType = {
                //Audit Info
                requestId: rId ?? '-',
                dateTime: Date.now(),
                //OrgInfo
                organisationId: auditContext.organisation?.id ?? '-',

                //UserInfo
                userId: auditContext.user?.id ?? '-',

                //EntityInfo
                entityId: changeSet.getSerializedPrimaryKey() ?? '-',
                entityName: changeSet.name,

                //type
                type: changeSet.type,

                //payloadData
                before: JSON.stringify(changeSet.originalEntity),
                after: JSON.stringify(changeSet.payload),
            };

            computedChanges.push(computedChange);
        }

        if (computedChanges.length > 0) {
            this.logger.debug(`There are ${computedChanges.length} computed changes`);
            for (const computedChange of computedChanges) {
                this.logger.debug(`Computed Change: ${JSON.stringify(computedChange)}`);
            }
            // save the computed changes somewhere
        }
    }
}
