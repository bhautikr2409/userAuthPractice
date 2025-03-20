const Joi = require('joi');

const userValidationSchema = {
    register: Joi.object({
        firstname: Joi.string()
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.empty': 'First name is required',
                'string.min': 'First name must be at least 2 characters long'
            }),

        lastname: Joi.string()
            .min(2)
            .max(30)
            .messages({
                'string.min': 'Last name must be at least 2 characters long'
            }),

        age: Joi.number()
            .integer()
            .min(18)
            .required()
            .messages({
                'number.min': 'Age must be at least 18',
                'number.empty': 'Age is required'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email',
                'string.empty': 'Email is required'
            }),

        password: Joi.string()
            .min(6)
            .max(30)
            .pattern(/^[A-Z]/)
            .message('Password must start with a capital letter')
            .pattern(/[@$&]/)
            .message('Password must contain at least one special character (@, $, or &)')
            .pattern(/[0-9]/)
            .message('Password must contain at least one number')
            .pattern(/^[a-zA-Z0-9@$&]{6,30}$/)
            .message('Password must be 6-30 characters long and can only contain letters, numbers, and special characters (@, $, &)')
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password cannot exceed 30 characters'
            })
    })
};

const validateUser = (validationSchema) => {
    return async (req, res, next) => {
        try {
            const validated = await validationSchema.validateAsync(req.body, {
                abortEarly: false
            });
            req.validatedBody = validated; // discuss with mentor 
            next();
        } catch (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }
    };
};

module.exports = {
    userValidationSchema,
    validateUser
};