import {AnyObject} from '@loopback/repository';
import sinon from 'sinon';
import {listSchema} from '../../../schemas';
import {expectSchemaValidationFailure, expectSchemaValidationSuccess} from '../../helpers';
import {expect} from '../../helpers/test-modules';

describe('listSchema', () => {
  const sandbox = sinon.createSandbox();
  let body: AnyObject;

  beforeEach(() => {
    body = {};
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('listSchema', () => {
    beforeEach(() => {
      body = {
        name: 'Title',
        description: 'long description',
      };
    });

    it('should return converted params as expected', async () => {
      const validatedBody = await listSchema.validateAsync(body);
      const expectedParams = {
        name: 'Title',
        description: 'long description',
      };
      expect(validatedBody).to.deep.equals(expectedParams);
    });
  });


  describe('"description"', () => {
    beforeEach(() => {
      body = {
        name: 'Titel',
        description: 'description',
      };
    });

    it('should be a string', async () => {
      body.description = ['description string'];
      await expectSchemaValidationFailure(listSchema, body, 'string.base');
    });

    it('can be empty', async () => {
      body.description = '';
      await expectSchemaValidationSuccess(listSchema, body);
    });
  });

  describe('"name"', () => {
    beforeEach(() => {
      body = {
        name: 'name',
        description: '0',
      };
    });

    it('should throw error if "title" is missing', async () => {
      delete body.name;
      await expectSchemaValidationFailure(listSchema, body, 'any.required');

      it('should be a string', async () => {
        body.name = 123;
        await expectSchemaValidationFailure(listSchema, body, 'string.base');
      });

      it('cannot be empty', async () => {
        body.name = '';
        await expectSchemaValidationFailure(listSchema, body, 'string.base');
      });
    });
  });
});
