import {Getter, inject, injectable} from '@loopback/core';
import {BelongsToAccessor, BelongsToDefinition, createBelongsToAccessor, createHasManyRepositoryFactory, DefaultTransactionalRepository, HasManyDefinition, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import { BaseBookRepository, BaseEntryRepository } from '.';
import {LibraryAppDb} from '../datasources';
import {OrmBook, OrmEntry, OrmList, OrmListRelations, OrmUser} from '../models';
import { Base } from './keys';
import { BaseUserRepository } from './orm-user.repository';

@injectable({ tags: { key: Base.Repository.LIST } })
export class BaseListRepository extends DefaultTransactionalRepository<
  OrmList,
  typeof OrmList.prototype.id,
  OrmListRelations
> {

  public readonly user: BelongsToAccessor<OrmUser, typeof OrmUser.prototype.id>;
  public readonly entries: HasManyRepositoryFactory<OrmEntry, typeof OrmEntry.prototype.id>;
  public readonly books: HasManyThroughRepositoryFactory<OrmBook, typeof OrmBook.prototype.id, OrmEntry, typeof OrmEntry.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.USER) userRepositoryGetter: Getter<BaseUserRepository>,
    @inject.getter(Base.Repository.ENTRY) entryRepositoryGetter: Getter<BaseEntryRepository>,
    @inject.getter(Base.Repository.BOOK) bookRepositoryGetter: Getter<BaseBookRepository>
  ) {
    super(OrmList, dataSource);


    const userMeta = this.entityClass.definition.relations['user'];
    this.user = createBelongsToAccessor(userMeta as BelongsToDefinition, userRepositoryGetter, this);
    this.registerInclusionResolver('user', this.user.inclusionResolver);

    const entriesMeta = this.entityClass.definition.relations['entries'];
    this.entries = createHasManyRepositoryFactory(
      entriesMeta as HasManyDefinition,
      entryRepositoryGetter
    );
    this.registerInclusionResolver('entries', this.entries.inclusionResolver);

    this.books =  this.createHasManyThroughRepositoryFactoryFor(
      'books',
      bookRepositoryGetter,
      entryRepositoryGetter
    );
    this.registerInclusionResolver('books', this.books.inclusionResolver);


  }
}
