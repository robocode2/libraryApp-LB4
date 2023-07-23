import { BindingKey } from "@loopback/core";
import { BaseBookRepository } from "./book.repository";
import { BaseEntryRepository } from "./entry.repository";
import { BaseListRepository } from "./list.repository";
import { BaseUserRepository } from "./user.repository";

export namespace Base {
    export namespace Repository {
      export const BOOK = BindingKey.create<BaseBookRepository>('base.repositories.book');
      export const LIST = BindingKey.create<BaseListRepository>('base.repositories.list');
      export const ENTRY = BindingKey.create<BaseEntryRepository>('base.repositories.entry');
      export const USER = BindingKey.create<BaseUserRepository>('base.repositories.user');

    }
}