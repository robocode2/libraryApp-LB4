import {AnyObject} from '@loopback/repository';
import sinon from 'sinon';
import {entrySchema} from '../../../schemas';
import {expectSchemaValidationFailure} from '../../helpers';
import {expect} from '../../helpers/test-modules';

describe('entrySchema', () => {
  const sandbox = sinon.createSandbox();
  let body: AnyObject;

  beforeEach(() => {
    body = {};
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('entrySchema', () => {
    beforeEach(() => {
      body = {
        bookId: '132',
        listId: '231',
      };
    });

    it('should return converted params as expected', async () => {
      const validatedBody = await entrySchema.validateAsync(body);
      const expectedParams = {
        bookId: 132,
        listId: 231,
      };
      expect(validatedBody).to.deep.equals(expectedParams);
    });
  });

  describe('"bookId"', () => {
    beforeEach(() => {
      body = {
        listId: '2'
      };
    });

    it('should be required', async () => {
      await expectSchemaValidationFailure(entrySchema, body, 'any.required');
    });

    it('should be a numberical value', async () => {
      body.bookId = 'NaN';
      await expectSchemaValidationFailure(entrySchema, body, 'number.base');
    });

    it('should be a whole number', async () => {
      body.bookId = '1.2';
      await expectSchemaValidationFailure(entrySchema, body, 'number.integer');
    });

    it('should be >=0', async () => {
      body.bookId = '-1';
      await expectSchemaValidationFailure(entrySchema, body, 'number.positive');
    });
  });


  describe('"listId"', () => {
    beforeEach(() => {
      body = {
        bookId: '1',
      };
    });

    it('should be required', async () => {
      await expectSchemaValidationFailure(entrySchema, body, 'any.required');
    });

    it('should be a numberical value', async () => {
      body.listId = 'NaN';
      await expectSchemaValidationFailure(entrySchema, body, 'number.base');
    });

    it('should be a whole number', async () => {
      body.listId = '1.2';
      await expectSchemaValidationFailure(entrySchema, body, 'number.integer');
    });

    it('should be >=0', async () => {
      body.listId = '-1';
      await expectSchemaValidationFailure(entrySchema, body, 'number.positive');
    });
  });
});
