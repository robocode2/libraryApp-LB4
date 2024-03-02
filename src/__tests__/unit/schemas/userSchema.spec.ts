import {AnyObject} from '@loopback/repository';
import sinon from 'sinon';
import {userSchema} from '../../../schemas';
import {expectSchemaValidationFailure} from '../../helpers';
import {expect} from '../../helpers/test-modules';

describe.only('userSchema', () => {
  const sandbox = sinon.createSandbox();
  let body: AnyObject;

  beforeEach(() => {
    body = {};
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('userSchema', () => {
    beforeEach(() => {
      body = {
        username: 'username',
        password: 'passworD123!',
        email: 'username@test.com'
      };
    });

    it('should return converted params as expected', async () => {
      const validatedBody = await userSchema.validateAsync(body);
      const expectedParams = {
        username: 'username',
        password: 'passworD123!',
        email: 'username@test.com'
      };
      expect(validatedBody).to.deep.equal(expectedParams);
    });


    describe('"username"', () => {
      beforeEach(() => {
        body = {
          username: 'username',
          password: 'passworD123!',
          email: 'username@test.com'
        };
      });

      it('should be provided', async () => {
        delete body.username;
        await expectSchemaValidationFailure(userSchema, body, 'any.required');
      });

      it('should be a string', async () => {
        body.username = ['username string'];
        await expectSchemaValidationFailure(userSchema, body, 'string.base');
      });

      it('should not exceed 30 characters in length', async () => {
        body.username = 'a'.repeat(31); // More than 30 characters
        await expectSchemaValidationFailure(userSchema, body, 'string.max');
      });
    });

    describe('"password"', () => {
      beforeEach(() => {
        body = {
          username: 'username',
          password: 'passworD123!',
          email: 'username@test.com'
        };
      });

      it('should be provided', async () => {
        delete body.password;
        await expectSchemaValidationFailure(userSchema, body, 'any.required');
      });

      it('should be a string', async () => {
        body.password = ['password string'];
        await expectSchemaValidationFailure(userSchema, body, 'string.base');
      });

      it('should match the specified pattern', async () => {
        body.password = 'weakpassword'; // Does not match pattern
        await expectSchemaValidationFailure(userSchema, body, 'string.pattern.base');
      });

      it('should not exceed 30 characters in length', async () => {
        body.password = 'a'.repeat(31); // More than 30 characters
        await expectSchemaValidationFailure(userSchema, body, 'string.max');
      });

      it('should not be too short', async () => {
        body.password = 'a'; // Less than 3 characters
        await expectSchemaValidationFailure(userSchema, body, 'string.min');
      });

      it('should contain at least one uppercase letter', async () => {
        body.password = 'password123!'; // Missing uppercase letter
        await expectSchemaValidationFailure(userSchema, body, 'string.pattern.base');
      });

      it('should contain at least one lowercase letter', async () => {
        body.password = 'PASSWORD123!'; // Missing lowercase letter
        await expectSchemaValidationFailure(userSchema, body, 'string.pattern.base');
      });

      it('should contain at least one digit', async () => {
        body.password = 'Password!'; // Missing digit
        await expectSchemaValidationFailure(userSchema, body, 'string.pattern.base');
      });
    });

    describe('"email"', () => {
      it('should be provided', async () => {
        delete body.email;
        await expectSchemaValidationFailure(userSchema, body, 'any.required');
      });

      it('should be a valid email', async () => {
        body.email = 'invalidemail'; // Invalid email format
        await expectSchemaValidationFailure(userSchema, body, 'string.email');
      });
    });
  });
});
