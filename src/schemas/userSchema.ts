import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()-_+=<>?]{3,30}$')),
  email: Joi.string().email().required()
});
