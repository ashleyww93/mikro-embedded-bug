import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { GraphQLBoolean, GraphQLString } from 'graphql/type';
import { Embedded, Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../database/abstract-entities/entity.base';
import { Stats } from './stats.embeddable';

@ObjectType({
    description: 'This object represents an organisation.',
})
@Entity()
export class Organisation extends BaseEntity {
    @Property({ nullable: true })
    @Field(() => GraphQLISODateTime, {
        description: 'The date and time this organisation received ingestion data',
        nullable: true,
    })
    lastIngestionDataDate?: Date;

    @Property()
    @Field(() => GraphQLString)
    name: string;

    @Property({ default: false })
    @Field(() => GraphQLBoolean)
    someBoolean: boolean;

    @Field(() => Stats, { nullable: true })
    @Embedded({ entity: () => Stats, prefix: true, array: false, object: true, nullable: true })
    bookStats?: Stats;

    @Field(() => Stats, { nullable: true })
    @Embedded({ entity: () => Stats, prefix: true, array: false, object: true, nullable: true })
    orderStats?: Stats;
}
