import Joi from 'joi';

export const listSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, '').optional(),
});
