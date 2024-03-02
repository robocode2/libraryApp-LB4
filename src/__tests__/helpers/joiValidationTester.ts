// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {AnySchema, SchemaLike} from '@hapi/joi';
import {AnyObject} from '@loopback/repository';
import {expect} from 'chai';
import {AssertionError} from './test-modules';


export function expectJoiError(error, expectedErrorType) {
  expect(error).not.to.be.instanceOf(AssertionError);
  expect(error.isJoi).to.equal(true);
  expect(error.details[0].type).to.equal(expectedErrorType);
}

export async function expectSchemaValidationFailure(
  joiSchema: AnySchema,
  value: SchemaLike,
  expectedErrorDetailsType: string
) {
  try {
    await joiSchema.validateAsync(value);
    expect.fail('should throw validation error');
  } catch (error) {
    expectJoiError(error, expectedErrorDetailsType);
  }
}

export async function expectSchemaValidationSuccess(
  joiSchema: AnySchema,
  value: SchemaLike,
  expectedResult?: AnyObject
) {
  const result = await joiSchema.validateAsync(value);
  const expected = expectedResult ? expectedResult : value;
  expect(result).to.deep.include({...expected});
}
