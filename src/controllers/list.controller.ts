import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, injectable} from '@loopback/core';
import {
  FilterExcludingWhere,
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  param,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Auth} from '../auth/keys';
import {List} from '../models';
import {BaseEntryRepository, BaseListRepository} from '../repositories';
import {Base} from '../repositories/keys';
import {listSchema} from '../schemas';


@injectable({tags: {name: 'ListController'}})
@authenticate('jwt')
export class ListController {
  constructor(
    @inject(Base.Repository.LIST) private listRepository: BaseListRepository,
    @inject(Base.Repository.ENTRY) private entryRepository: BaseEntryRepository
  ) { }

  @post('/lists')
  async create(
    @requestBody() request: any,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<List> {
    const data = await listSchema.validateAsync(request);
    data.userId = currentUserProfile[securityId];
    return this.listRepository.create(data);
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @get('/lists/{listId}')
  async findById(
    @param.path.number('listId') listId: number,
    @param.filter(List, {exclude: 'where'}) filter?: FilterExcludingWhere<List>
  ): Promise<List> {
    const listExists = await this.listRepository.exists(listId);
    if (!listExists) {
      throw new HttpErrors.NotFound('List not found');
    }
    return this.listRepository.findById(listId, filter);
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @del('/lists/{listId}')
  async deleteById(
    @param.path.number('listId') listId: number
  ): Promise<void> {
    const listExists = await this.listRepository.exists(listId);
    if (!listExists) {
      throw new HttpErrors.NotFound('List not found');
    }
    await this.entryRepository.deleteAll({listId});
    await this.listRepository.deleteById(listId);
  }
}
