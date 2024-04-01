import * as Joi from 'joi';

export const runtimeSchema = {
    PORT: Joi.number().default(3123),
    RELEASE_TYPE: Joi.string().valid('local', 'development', 'production').required(),
    PACKAGE_VERSION: Joi.string().default('local'),
    HOST: Joi.string().hostname().required(),
};
