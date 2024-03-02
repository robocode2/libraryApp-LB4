import {AnyObject} from '@loopback/repository';
import {expect} from 'chai';
import sinon from 'sinon';
import {bookSchema} from '../../../schemas';
import {expectSchemaValidationFailure, expectSchemaValidationSuccess} from '../../helpers';

describe('bookSchema', () => {
  const sandbox = sinon.createSandbox();
  let body: AnyObject;

  beforeEach(() => {
    body = {};
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('bookSchema', () => {
    beforeEach(() => {
      body = {
        title: 'Title',
        description: 'long description',
        isbn: '2123'
      };
    });

    it('should return converted params as expected', async () => {
      const validatedBody = await bookSchema.validateAsync(body);
      const expectedParams = {
        title: 'Title',
        description: 'long description',
        isbn: 2123
      };
      expect(validatedBody).to.deep.equals(expectedParams);
    });
  });

  describe('"ISBN"', () => {
    beforeEach(() => {
      body = {
        title: 'Title',
        description: 'long description',
      };
    });

    it('should be required', async () => {
      delete body.isbn;
      await expectSchemaValidationFailure(bookSchema, body, 'any.required');
    });

    it('should be a numberical value', async () => {
      body.isbn = 'NaN';
      await expectSchemaValidationFailure(bookSchema, body, 'number.base');
    });

    it('should be a whole number', async () => {
      body.isbn = '1.2';
      await expectSchemaValidationFailure(bookSchema, body, 'number.integer');
    });

    it('should be >=0', async () => {
      body.isbn = '-1';
      await expectSchemaValidationFailure(bookSchema, body, 'number.positive');
    });
  });

  describe('"description"', () => {
    beforeEach(() => {
      body = {
        title: 'Titel',
        description: 'description',
        isbn: 2123
      };
    });

    it('does not have to be provided', async () => {
      delete body.description;
      await expectSchemaValidationSuccess(bookSchema, body);
    });

    it('should be a string', async () => {
      body.description = ['description string'];
      await expectSchemaValidationFailure(bookSchema, body, 'string.base');
    });

    it('can be empty', async () => {
      body.description = '';
      await expectSchemaValidationSuccess(bookSchema, body);
    });
  });


  describe('"title"', () => {
    beforeEach(() => {
      body = {
        title: 'Titel',
        description: '0',
        isbn: '2123'
      };
    });

    it('should throw error if "title" is missing', async () => {
      delete body.title;
      await expectSchemaValidationFailure(bookSchema, body, 'any.required');
    });

    it('should be a string', async () => {
      body.title = 123;
      await expectSchemaValidationFailure(bookSchema, body, 'string.base');
    });

    it('cannot be empty', async () => {
      body.title = '';
      await expectSchemaValidationFailure(bookSchema, body, 'string.empty');
    });
  });
});
