import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer
} from '@loopback/authorization';
import {Provider, inject} from '@loopback/core';
import {BaseUserRepository} from '../../../repositories';
import {Base} from '../../../repositories/keys';
import {UserProfile} from '../../domain/models/UserProfile';
import {IAuthorizationService} from '../../domain/services';
import {Auth} from '../../keys';

export class AuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject(Auth.Service.AUTHORIZATION) public authorizationService: IAuthorizationService,
    @inject(Base.Repository.USER) public userRepo: BaseUserRepository,

  ) { }

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(context: AuthorizationContext, metadata: AuthorizationMetadata) {
    const userProfile: UserProfile | undefined = context.principals[0] as UserProfile;

    const user = await this.userRepo.findById(userProfile.id)
    const allowedRoles: string[] = metadata.allowedRoles ?? [];

    // Global Authorization by Roles
    if (!this.authorizationService.authorize(user, allowedRoles)) {
      return AuthorizationDecision.DENY;
    }

    return AuthorizationDecision.ALLOW;
  }
}
