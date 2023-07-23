import { UserCredentials } from '@loopback/authentication-jwt';
import {Getter, inject, injectable} from '@loopback/core';
import {createHasManyRepositoryFactory, createHasOneRepositoryFactory, DefaultCrudRepository, HasManyDefinition, HasManyRepositoryFactory, HasOneDefinition, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {LibraryAppDb} from '../datasources';
import {List, User, OrmUserRelations} from '../models';
import { Base } from './keys';
import { BaseListRepository } from './list.repository';
//import { UserCredentialsRepository } from './userCredentials.repository';

@injectable({ tags: { key: Base.Repository.USER } })
export class BaseUserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  OrmUserRelations
> {

/*   public readonly credential: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >; */
  public readonly lists: HasManyRepositoryFactory<List, typeof User.prototype.id>;

  constructor(
    @inject('datasources.libraryApp') dataSource: LibraryAppDb,
    @inject.getter(Base.Repository.LIST) listRepositoryGetter: Getter<BaseListRepository>,
   /*  @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>, */
  ) {
    super(User, dataSource);

/*     const credentialsMeta = this.entityClass.definition.relations['credential'];
    this.credential = createHasOneRepositoryFactory(credentialsMeta as HasOneDefinition,
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'credential',
      this.credential.inclusionResolver,
    );
 */

    const listsMeta = this.entityClass.definition.relations['lists'];
    this.lists = createHasManyRepositoryFactory(listsMeta as HasManyDefinition, listRepositoryGetter);
    this.registerInclusionResolver('lists', this.lists.inclusionResolver);

  }

/*   async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    return this.credential(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  } */
}
