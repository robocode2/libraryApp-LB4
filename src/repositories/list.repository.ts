import {Getter, inject, injectable} from '@loopback/core';
import {BelongsToAccessor, BelongsToDefinition, createBelongsToAccessor, createHasManyRepositoryFactory, DefaultTransactionalRepository, HasManyDefinition, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import { BaseBookRepository, BaseEntryRepository } from '.';
import {LibraryAppDb} from '../datasources';
import {Book, Entry, List, OrmListRelations, User} from '../models';
import { Base } from './keys';
import { BaseUserRepository } from './user.repository';

@injectable({ tags: { key: Base.Repository.LIST } })
export class BaseListRepository extends DefaultTransactionalRepository<
  List,
  typeof List.prototype.id,
  OrmListRelations
> {

  public readonly user: BelongsToAccessor<User, typeof User.prototype.id>;
  public readonly entries: HasManyRepositoryFactory<Entry, typeof Entry.prototype.id>;
  public readonly books: HasManyThroughRepositoryFactory<Book, typeof Book.prototype.id, Entry, typeof Entry.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.USER) userRepositoryGetter: Getter<BaseUserRepository>,
    @inject.getter(Base.Repository.ENTRY) entryRepositoryGetter: Getter<BaseEntryRepository>,
    @inject.getter(Base.Repository.BOOK) bookRepositoryGetter: Getter<BaseBookRepository>
  ) {
    super(List, dataSource);

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
