import {Getter, inject, injectable} from '@loopback/core';
import {DefaultCrudRepository, HasManyDefinition, HasManyRepositoryFactory, createHasManyRepositoryFactory} from '@loopback/repository';
import {LibraryAppDb} from '../datasources';
import {List, OrmUserRelations, User} from '../models';
import {Base} from './keys';
import {BaseListRepository} from './list.repository';

@injectable({tags: {key: Base.Repository.USER}})
export class BaseUserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  OrmUserRelations
> {

  public readonly lists: HasManyRepositoryFactory<List, typeof User.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>,

  ) {
    super(User, dataSource);

    const listsMeta = this.entityClass.definition.relations['lists'];
    this.lists = createHasManyRepositoryFactory(listsMeta as HasManyDefinition, listRepositoryGetter);
    this.registerInclusionResolver('lists', this.lists.inclusionResolver);

  }

}
