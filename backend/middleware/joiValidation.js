import Joi from "joi";

export const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const signInSchema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().required()
});

export const modelSchema = Joi.object({
    userQuery: Joi.string().min(1).required(),
    model: Joi.string().required(),
    conversationId: Joi.string().allow('').required()
});