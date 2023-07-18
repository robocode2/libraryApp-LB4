import {Getter, inject, injectable} from '@loopback/core';
import {createHasManyRepositoryFactory, DefaultCrudRepository, HasManyDefinition, HasManyRepositoryFactory} from '@loopback/repository';
import {LibraryAppDb} from '../datasources';
import {OrmList, OrmUser, OrmUserRelations} from '../models';
import { Base } from './keys';
import { BaseListRepository } from './orm-list.repository';

@injectable({ tags: { key: Base.Repository.USER } })
export class BaseUserRepository extends DefaultCrudRepository<
  OrmUser,
  typeof OrmUser.prototype.id,
  OrmUserRelations
> {

  public readonly lists: HasManyRepositoryFactory<OrmList, typeof OrmUser.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>
  ) {
    super(OrmUser, dataSource);

    const listsMeta = this.entityClass.definition.relations['lists'];
    this.lists = createHasManyRepositoryFactory(listsMeta as HasManyDefinition, listRepositoryGetter);
    this.registerInclusionResolver('lists', this.lists.inclusionResolver);
  }
}
