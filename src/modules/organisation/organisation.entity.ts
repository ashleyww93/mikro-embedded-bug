import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { GraphQLBoolean, GraphQLString } from 'graphql/type';
import { Collection, Embedded, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../database/abstract-entities/entity.base';
import { OrganisationMetadata } from './metadata/organisation.metadata.entity';
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

    @OneToMany(() => OrganisationMetadata, metadata => metadata.organisation, { orphanRemoval: true })
    @Field(() => [OrganisationMetadata])
    metadata = new Collection<OrganisationMetadata>(this);
}
