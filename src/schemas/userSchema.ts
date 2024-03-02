import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().max(30).required(), // At most 30 characters long
  password: Joi.string()
    .min(3) // At least 3 characters long
    .max(30) // At most 30 characters long
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()-_+=<>?])[a-zA-Z\\d!@#$%^&*()-_+=<>?]{3,30}$'))
    .required(),
  email: Joi.string().email().required()
});
