import { BindingKey } from "@loopback/core";
import { OwnListOnlyUseCase } from "./application/useCases";
import { ListAccessService } from "./domain/services";
import { Authorizer } from '@loopback/authorization';



export namespace Auth {
    export namespace UseCase {
      export const OWN_LIST_ONLY = BindingKey.create<OwnListOnlyUseCase>('auth.useCases.ownListOnly');
    }

    export namespace Service {
        export const LIST_ACCESS = BindingKey.create<ListAccessService>('auth.services.listAccess')
    }

    export namespace Provider {
      export const OWN_LIST_ONLY = BindingKey.create<Authorizer>('auth.providers.ownListOnly');
    }
}