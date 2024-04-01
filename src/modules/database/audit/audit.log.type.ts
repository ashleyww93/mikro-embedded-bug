export type AuditLogType = {
    //Audit Info
    requestId: string;
    dateTime: number;

    //Org Info
    organisationId: string;

    //User Info
    userId: string;

    //Entity Info
    entityId: string;
    entityName: string;

    //type = create, update, delete
    type: string;

    //payload data
    before: string;
    after: string;
};
