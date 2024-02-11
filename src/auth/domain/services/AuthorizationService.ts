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

  private fulfillsRoleRequirements(role: Role, allowedRoles: string[]): boolean {
    return _.includes(allowedRoles, role);
  }



  public authorize(user: User, allowedRoles: string[]): boolean {
    const role: Role = user.role; //TODOX! wrong. no roles here. need to overwrite the user profile model.

    if (!user || !allowedRoles.length) {
      return false;
    }

    console.log(this.fulfillsRoleRequirements(role, allowedRoles))
    return this.fulfillsRoleRequirements(role, allowedRoles);
  }
}
