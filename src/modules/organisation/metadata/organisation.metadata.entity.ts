import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { Cascade, Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from '../../database/abstract-entities/entity.base';
import { Organisation } from '../organisation.entity';

@ObjectType()
@Entity()
export class OrganisationMetadata extends BaseEntity {
    @ManyToOne(() => Organisation, { cascade: [Cascade.ALL] })
    @Field(() => Organisation)
    organisation: Organisation;

    @Property({ type: types.text })
    @Field(() => GraphQLString)
    key: string;

    @Property({ type: types.text })
    @Field(() => GraphQLString)
    value: string;
}
