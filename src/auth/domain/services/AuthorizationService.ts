import {injectable} from '@loopback/core';
import _ from 'lodash';
import {User} from '../../../models';
import {Auth} from '../../keys';
import {Role} from '../models';

export interface IAuthorizationService {
  authorize(user: User, allowedRoles: string[]): boolean;
}

@injectable({tags: {key: Auth.Service.AUTHORIZATION}})
export class AuthorizationService implements IAuthorizationService {
  constructor() { }

  public authorize(user: User, allowedRoles: string[]): boolean {
    if (!allowedRoles.length) {
      return true;
    }
    const role: Role = user.role;
    return _.includes(allowedRoles, role)
  }
}
