import Joi from 'joi';

export const entrySchema = Joi.object({
  bookId: Joi.number().integer().positive().empty(''),
  listId: Joi.number().integer().positive().empty('')
});


