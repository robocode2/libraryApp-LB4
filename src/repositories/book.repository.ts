import {Getter, inject, injectable} from '@loopback/core';
import {DefaultTransactionalRepository, HasManyDefinition, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, createHasManyRepositoryFactory} from '@loopback/repository';
import {LibraryAppDb} from '../datasources';
import {Book, Entry, List, OrmBookRelations} from '../models';
import {BaseEntryRepository} from './entry.repository';
import {Base} from './keys';
import {BaseListRepository} from './list.repository';

@injectable({tags: {key: Base.Repository.BOOK}})
export class BaseBookRepository extends DefaultTransactionalRepository<
  Book,
  typeof Book.prototype.id,
  OrmBookRelations
> {

  public readonly entries: HasManyRepositoryFactory<Entry, typeof Entry.prototype.id>;
  public readonly lists: HasManyThroughRepositoryFactory<
    List,
    typeof List.prototype.id,
    Entry,
    typeof Entry.prototype.id
  >;


  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.ENTRY) entryRepositoryGetter: Getter<BaseEntryRepository>,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>
  ) {
    super(Book, dataSource);

    const entriesMeta = this.entityClass.definition.relations['entries'];
    this.entries = createHasManyRepositoryFactory(
      entriesMeta as HasManyDefinition,
      entryRepositoryGetter
    );
    this.registerInclusionResolver('entries', this.entries.inclusionResolver);

    this.lists = this.createHasManyThroughRepositoryFactoryFor(
      'lists',
      listRepositoryGetter,
      entryRepositoryGetter
    );
    this.registerInclusionResolver('lists', this.lists.inclusionResolver);


  }



}
