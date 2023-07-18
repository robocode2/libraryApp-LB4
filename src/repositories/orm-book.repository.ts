import {Getter, inject, injectable} from '@loopback/core';
import {createHasManyRepositoryFactory, DefaultTransactionalRepository, HasManyDefinition, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {LibraryAppDb} from '../datasources';
import {OrmBook, OrmBookRelations, OrmEntry, OrmList} from '../models';
import { Base } from './keys';
import { BaseEntryRepository } from './orm-entry.repository';
import { BaseListRepository } from './orm-list.repository';

@injectable({ tags: { key: Base.Repository.BOOK } })
export class BaseBookRepository extends DefaultTransactionalRepository<
  OrmBook,
  typeof OrmBook.prototype.id,
  OrmBookRelations
> {

  //public readonly user: BelongsToAccessor<OrmUser, typeof OrmUser.prototype.id>;
  public readonly entries: HasManyRepositoryFactory<OrmEntry, typeof OrmEntry.prototype.id>;
  public readonly lists: HasManyThroughRepositoryFactory<
  OrmList,
  typeof OrmList.prototype.id,
  OrmEntry,
  typeof OrmEntry.prototype.id
>;


  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    //@inject.getter(Base.Repository.USER) userRepositoryGetter: Getter<BaseUserRepository>,
    @inject.getter(Base.Repository.ENTRY) entryRepositoryGetter: Getter<BaseEntryRepository>,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>
  ) {
    super(OrmBook, dataSource);

    const entriesMeta = this.entityClass.definition.relations['entries'];
    this.entries = createHasManyRepositoryFactory(
      entriesMeta as HasManyDefinition,
      entryRepositoryGetter
    );
    this.registerInclusionResolver('entries', this.entries.inclusionResolver);

    this.lists =  this.createHasManyThroughRepositoryFactoryFor(
      'lists',
      listRepositoryGetter,
      entryRepositoryGetter
    );
    this.registerInclusionResolver('lists', this.lists.inclusionResolver);


  }



}
