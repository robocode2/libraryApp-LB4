import {Authorizer} from '@loopback/authorization';
import {BindingKey} from "@loopback/core";
import {OwnListOnlyUseCase} from "./application/useCases";
import {AuthorizationService, ListAccessService} from "./domain/services";



export namespace Auth {
  export namespace UseCase {
    export const OWN_LIST_ONLY = BindingKey.create<OwnListOnlyUseCase>('auth.useCases.ownListOnly');
  }

  export namespace Service {
    export const AUTHORIZATION = BindingKey.create<AuthorizationService>('auth.services.authorization')
    export const LIST_ACCESS = BindingKey.create<ListAccessService>('auth.services.listAccess')
  }

  export namespace Provider {
    export const AUTHORIZATION_PROVIDER = BindingKey.create<Authorizer>('auth.providers.authorization');
  }

  export namespace Voter {
    export const OWN_LIST_ONLY = BindingKey.create<Authorizer>('auth.providers.ownListOnly');
  }
}
