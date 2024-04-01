import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Property, types } from '@mikro-orm/core';
import { BaseEntity } from '../database/abstract-entities/entity.base';

@ObjectType()
@Entity({
    tableName: 'tools',
})
export class ToolsEntity extends BaseEntity {
    @Property({ type: types.integer, default: 0 })
    @Field()
    mutations: number;
}
