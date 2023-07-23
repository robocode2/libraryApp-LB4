import {Getter, inject, injectable} from '@loopback/core';
import {BelongsToAccessor, BelongsToDefinition, createBelongsToAccessor, DefaultTransactionalRepository} from '@loopback/repository';
import { LibraryAppDb } from '../datasources';
import {Book, Entry, OrmEntryRelations, List} from '../models';
import { Base } from './keys';
import { BaseBookRepository } from './book.repository';
import { BaseListRepository } from './list.repository';

@injectable({ tags: { key: Base.Repository.ENTRY } })
export class BaseEntryRepository extends DefaultTransactionalRepository<
  Entry,
  typeof Entry.prototype.id,
  OrmEntryRelations
> {

  public readonly book: BelongsToAccessor<Book, typeof Book.prototype.id>;
  public readonly list: BelongsToAccessor<List, typeof List.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.BOOK) bookRepositoryGetter: Getter<BaseBookRepository>,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>
  ) {
    super(Entry, dataSource);

    const bookMeta = this.entityClass.definition.relations['book'];
    this.book = createBelongsToAccessor(bookMeta as BelongsToDefinition, bookRepositoryGetter, this);
    this.registerInclusionResolver('book', this.book.inclusionResolver);

    const listMeta = this.entityClass.definition.relations['list'];
    this.list = createBelongsToAccessor(listMeta as BelongsToDefinition, listRepositoryGetter, this);
    this.registerInclusionResolver('list', this.list.inclusionResolver);
    
  }
}
