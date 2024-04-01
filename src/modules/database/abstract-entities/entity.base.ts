import { Field, ObjectType } from '@nestjs/graphql';
import { Index, PrimaryKey, Property } from '@mikro-orm/core';
import { ulid } from 'ulid';

@ObjectType()
export abstract class BaseEntity {
    constructor() {
        this.id = ulid();
    }
    @Index()
    @PrimaryKey()
    @Field()
    id: string;

    @Field()
    @Property({ defaultRaw: 'NOW()' })
    createdAt: Date = new Date();

    @Field()
    @Property({ defaultRaw: 'NOW()', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
