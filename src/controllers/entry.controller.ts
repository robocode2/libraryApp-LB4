import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, injectable} from '@loopback/core';
import {
  HttpErrors,
  del,
  get,
  param,
  post,
  requestBody
} from '@loopback/rest';
import {Auth} from '../auth/keys';
import {Entry} from '../models';
import {BaseBookRepository, BaseEntryRepository, BaseListRepository} from '../repositories';
import {Base} from '../repositories/keys';
import {entrySchema} from '../schemas';

@injectable({tags: {name: 'EntryController'}})
@authenticate('jwt')
export class EntryController {
  constructor(
    @inject(Base.Repository.ENTRY) private entryRepository: BaseEntryRepository,
    @inject(Base.Repository.LIST) private listRepository: BaseListRepository,
    @inject(Base.Repository.BOOK) private bookRepository: BaseBookRepository,
  ) { }

  async checkListExists(listId: number): Promise<void> {
    const listExists = await this.listRepository.exists(listId);
    if (!listExists) {
      throw new HttpErrors.NotFound('List not found');
    }
  }

  async checkBookExists(bookId: number): Promise<void> {
    const bookExists = await this.bookRepository.exists(bookId);
    if (!bookExists) {
      throw new HttpErrors.NotFound('Book not found');
    }
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @post('/lists/{listId}/entries')
  async createEntry(
    @param.path.number('listId') listId: number,
    @requestBody() request: any,
  ): Promise<Entry> {
    const data = await entrySchema.validateAsync(request);
    const existingEntry = await this.entryRepository.findOne({
      where: {listId, bookId: data.bookId},
    });
    if (existingEntry) {
      throw new Error('Entry with the provided book ID already exists in the list');
    }
    await this.checkBookExists(data.bookId);
    await this.checkListExists(listId);
    return this.entryRepository.create(data);
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @get('lists/{listId}/entries')
  async getListEntries(
    @param.path.number('listId') listId: number,
  ): Promise<Entry[]> {
    await this.checkListExists(listId);
    const filter = {where: {listId}}
    return this.entryRepository.find(filter);
  }

  @authorize({voters: [Auth.Voter.OWN_LIST_ONLY]})
  @del('lists/{listId}/entries/{id}')
  async findById(
    @param.path.number('listId') listId: number,
    @param.path.number('id') id: number,
  ): Promise<void> {
    await this.checkListExists(listId);
    const entry = await this.entryRepository.findById(id);
    if (!entry || entry.listId !== listId) {
      throw new HttpErrors.NotFound('Entry not found in the specified list');
    }
    await this.entryRepository.deleteById(id);
  }
}
