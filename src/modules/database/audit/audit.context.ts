export class AuditContext {
    static DEFAULT: AuditContext = {
        user: undefined,
        organisation: undefined,
    };

    user?: {
        id: string;
        displayName: string;
    };
    organisation?: {
        id: string;
        displayName: string;
    };
}
