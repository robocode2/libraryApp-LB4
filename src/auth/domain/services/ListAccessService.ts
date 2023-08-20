import { injectable } from '@loopback/core';
import { Auth } from '../../keys';

export interface IListAccessService {
  isAuthorized(ownedListIds: number[], requestedListId: number): boolean;
}

@injectable({ tags: { key: Auth.Service.LIST_ACCESS } })
export class ListAccessService {
  public isAuthorized(ownedListIds: number[], requestedListId: number): boolean {
    return ownedListIds.includes(requestedListId);
  }
}
