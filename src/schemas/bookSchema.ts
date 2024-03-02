import Joi from 'joi';

export const bookSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(null, '').optional(),
  isbn: Joi.number().integer().positive().required()
});
