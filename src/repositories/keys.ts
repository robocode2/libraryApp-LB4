import { BindingKey } from "@loopback/core";
import { BaseBookRepository } from "./orm-book.repository";
import { BaseEntryRepository } from "./orm-entry.repository";
import { BaseListRepository } from "./orm-list.repository";
import { BaseUserRepository } from "./orm-user.repository";

export namespace Base {
    export namespace Repository {
      export const BOOK = BindingKey.create<BaseBookRepository>('base.repositories.book');
      export const LIST = BindingKey.create<BaseListRepository>('base.repositories.list');
      export const ENTRY = BindingKey.create<BaseEntryRepository>('base.repositories.entry');
      export const USER = BindingKey.create<BaseUserRepository>('base.repositories.user');

    }
}