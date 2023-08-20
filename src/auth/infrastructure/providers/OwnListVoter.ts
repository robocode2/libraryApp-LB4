import { AuthorizationContext, AuthorizationDecision, Authorizer } from '@loopback/authorization';
import { inject, InvocationArgs, Provider } from '@loopback/core';
import { securityId } from '@loopback/security';
import { IOwnListOnlyUseCase } from '../../application/useCases';
import { Auth } from '../../keys';

export class OwnListOnlyVoter implements Provider<Authorizer> {
  constructor(@inject(Auth.UseCase.OWN_LIST_ONLY) public ownListOnlyUseCase: IOwnListOnlyUseCase) {}

  value(): Authorizer {
    return this.vote.bind(this);
  }

  async vote(context: AuthorizationContext): Promise<AuthorizationDecision> {
    const userId: string = context.principals[0] ? context.principals[0][securityId] : '';
        const args: InvocationArgs = context.invocationContext.args;

    if (!(typeof args[0] === 'number')) {
      return AuthorizationDecision.ABSTAIN;
    }

    if (!userId) {
      return AuthorizationDecision.DENY;
    }

    const listId: number = args[0];
    const isAuthorized: boolean = await this.ownListOnlyUseCase.authorize({ listId, userId });

    if (isAuthorized) {
      return AuthorizationDecision.ALLOW;
    }
    
    return AuthorizationDecision.DENY;
  }
}
