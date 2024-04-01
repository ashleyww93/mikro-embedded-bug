import { Field, ObjectType } from '@nestjs/graphql';
import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
@ObjectType({ description: 'An object used to store catalog reporting stats' })
export class Stats {
    constructor() {
        this.asExpected = false;
        this.extraInformation = '';
        this.numberHeldAtTimeOfReporting = 0;
    }

    @Property({ nullable: true })
    @Field({ description: 'The date/time these stats were reported to us', nullable: true })
    reportedAt?: Date;

    @Property()
    @Field()
    numberHeldAtTimeOfReporting: number;

    @Property()
    @Field()
    asExpected: boolean;

    @Property()
    @Field()
    extraInformation: string;
}
