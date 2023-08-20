import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject, injectable } from '@loopback/core';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Auth } from '../auth/keys';
import {Entry} from '../models';
import {BaseEntryRepository} from '../repositories';
import { Base } from '../repositories/keys';

@injectable({ tags: { name: 'EntryController' } })
@authenticate('jwt')
export class EntryController {
  constructor(
    @inject(Base.Repository.ENTRY) private entryRepository: BaseEntryRepository,
  ) {}

  @authorize({ voters: [Auth.Provider.OWN_LIST_ONLY] })
  @post('/lists/{listId}/entries')
  @response(200, {
    description: 'Entry model instance',
    content: {'application/json': {schema: getModelSchemaRef(Entry)}},
  })
  async createEntry(@param.path.number('listId') listId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entry)
        },
      },
    })
    entry: Entry,
  ): Promise<Entry> {
    return this.entryRepository.create(entry);
  }

  @authorize({ voters: [Auth.Provider.OWN_LIST_ONLY] })
  @get('lists/{listId}/entries')
  @response(200)
  async getListEntries(
    @param.path.number('listId') listId: number,
  ): Promise<Entry[]> {
    const filter = {where: {listId} }
    return this.entryRepository.find(filter);
  }

  @authorize({ voters: [Auth.Provider.OWN_LIST_ONLY] })
  @del('lists/{listId}/entries/{id}')
  @response(204)
  async findById(
    @param.path.number('listId') listId: number, //TODO I dont like that it's not being used. But it is. Can I improve?
    @param.path.number('id') id: number,
  ): Promise<void> {
     await this.entryRepository.deleteById(id);
  }
}
