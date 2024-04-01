import * as Joi from 'joi';
import { graphqlSchema } from './graphql.schema';
import { databaseSchema } from './database.schema';
import { runtimeSchema } from './runtime.schema';

export const configurationSchema = Joi.object({
    ...runtimeSchema,
    ...databaseSchema,
    ...graphqlSchema,
});
