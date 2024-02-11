import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, injectable} from '@loopback/core';
import {
  FilterExcludingWhere,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Auth} from '../auth/keys';
import {List} from '../models';
import {BaseEntryRepository, BaseListRepository} from '../repositories';
import {Base} from '../repositories/keys';


@injectable({tags: {name: 'ListController'}})
@authenticate('jwt')
export class ListController {
  constructor(
    @inject(Base.Repository.LIST) private listRepository: BaseListRepository,
    @inject(Base.Repository.ENTRY) private entryRepository: BaseEntryRepository
  ) { }

  @post('/lists')
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(List, {
            exclude: ['userId'],
          }),
        },
      },
    })
    list: List,
  ): Promise<List> {
    list.userId = currentUserProfile[securityId];
    return this.listRepository.create(list);
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @get('/lists/{listId}')
  @response(200, {
    description: 'List model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(List, { // TEST
          exclude: ['userId'],
        }),
      },
    },
  })
  async findById(
    @param.path.number('listId') listId: number,
    @param.filter(List, {exclude: 'where'}) filter?: FilterExcludingWhere<List>
  ): Promise<List> {
    return this.listRepository.findById(listId, filter);
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @del('/lists/{id}')
  @response(204, {
    description: 'List DELETE success',
  })
  async deleteById(
    @param.path.number('id') listId: number
  ): Promise<void> {
    const filter = {where: {listId}}
    await this.entryRepository.find(filter);
    await this.listRepository.deleteById(listId);
    // TODO Delete entries
  }
}
