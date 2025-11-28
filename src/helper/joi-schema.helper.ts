import Joi from 'joi';

export const errorMessage = {
    'string.base': '{#label} should be a type of text',
    'string.min': '{#label} should have a minimum length of {#limit}',
    'string.empty': '{#label} is not allowed to be empty',
    'string.max': '{#label} should be maximum {#limit} characters..',
    'string.pattern.base': 'Please enter valid {#label}',
    'any.required': '{#label} is a required field',
    'string.uuid': 'Please enter valid {#label}',
    'string.guid': 'Please enter valid {#label}',
};

export const joiCommon = {
    joiString: Joi.string()
        .trim()
        .messages({ ...errorMessage }),
    joiNumber: Joi.number().messages({ ...errorMessage }),
    joiBoolean: Joi.boolean().messages({ ...errorMessage }),
    joiDate: Joi.date()
        .iso()
        .messages({ ...errorMessage }),
    joiArray: Joi.array().messages({ ...errorMessage }),
    joiObject: Joi.object().messages({ ...errorMessage }),
    joiEmail: Joi.string()
        .label('Email')
        .messages({
            ...errorMessage,
            'string.email': '{#label} id is Invalid',
        })
        .email({ ignoreLength: true })
        .trim()
        .options({ convert: true }),
    // ** For Pagination **
    joiPage: Joi.number()
        .messages({ ...errorMessage })
        .allow('', null),
    joiLimit: Joi.number().messages({ ...errorMessage }),
    joiFields: Joi.string()
        .messages({ ...errorMessage })
        .allow('', null),
    joiExclude: Joi.string()
        .messages({ ...errorMessage })
        .allow('', null),
    joiSort: Joi.object().messages({ ...errorMessage }),
};

export const paginationSchema = Joi.object({
    page: joiCommon.joiPage,
    limit: joiCommon.joiLimit,
    exclude: joiCommon.joiExclude,
}).options({ abortEarly: false });

export const commonTableJoiSchema = {
    page: joiCommon.joiPage.optional(),
    limit: joiCommon.joiLimit.optional(),
    search: joiCommon.joiString.optional().allow(''),
    sortOrder: Joi.string().optional(),
    sortColumn: joiCommon.joiString.optional(),
};

export default {
    paginationSchema,
    joiCommon,
    errorMessage,
};
