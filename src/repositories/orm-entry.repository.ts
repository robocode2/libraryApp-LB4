import {Getter, inject, injectable} from '@loopback/core';
import {BelongsToAccessor, BelongsToDefinition, createBelongsToAccessor, DefaultTransactionalRepository} from '@loopback/repository';
import { LibraryAppDb } from '../datasources';
import {OrmBook, OrmEntry, OrmEntryRelations, OrmList} from '../models';
import { Base } from './keys';
import { BaseBookRepository } from './orm-book.repository';
import { BaseListRepository } from './orm-list.repository';

@injectable({ tags: { key: Base.Repository.ENTRY } })
export class BaseEntryRepository extends DefaultTransactionalRepository<
  OrmEntry,
  typeof OrmEntry.prototype.id,
  OrmEntryRelations
> {

  public readonly book: BelongsToAccessor<OrmBook, typeof OrmBook.prototype.id>;
  public readonly list: BelongsToAccessor<OrmList, typeof OrmList.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.BOOK) bookRepositoryGetter: Getter<BaseBookRepository>,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>
  ) {
    super(OrmEntry, dataSource);

    const bookMeta = this.entityClass.definition.relations['book'];
    this.book = createBelongsToAccessor(bookMeta as BelongsToDefinition, bookRepositoryGetter, this);
    this.registerInclusionResolver('book', this.book.inclusionResolver);

    const listMeta = this.entityClass.definition.relations['list'];
    this.list = createBelongsToAccessor(listMeta as BelongsToDefinition, listRepositoryGetter, this);
    this.registerInclusionResolver('list', this.list.inclusionResolver);
    
  }
}
