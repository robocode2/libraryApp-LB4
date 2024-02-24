import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, injectable} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
} from '@loopback/repository';
import {
  del,
  get,
  param,
  post,
  put,
  requestBody
} from '@loopback/rest';
import {Role} from '../auth/domain/models';
import {Book} from '../models';
import {BaseBookRepository, BaseEntryRepository} from '../repositories';
import {Base} from '../repositories/keys';
import {bookSchema} from '../schemas';


@injectable({tags: {name: 'BookController'}})
@authenticate('jwt')
export class BookController {
  constructor(
    @inject(Base.Repository.BOOK) private baseBookRepository: BaseBookRepository,
    @inject(Base.Repository.ENTRY) private baseEntryRepository: BaseEntryRepository,

  ) { }


  @authorize({allowedRoles: [Role.ADMIN]})
  @post('/books')
  async create(
    @requestBody() request: any,
  ): Promise<Book> {
    const data = await bookSchema.validateAsync(request);
    return this.baseBookRepository.create(data);
  }


  @get('/books')
  async find(
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<Book[]> {
    return this.baseBookRepository.find(filter);
  }

  @get('/books/{id}')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, {exclude: 'where'}) filter?: FilterExcludingWhere<Book>
  ): Promise<Book> {
    return this.baseBookRepository.findById(id, filter);
  }

  @authorize({allowedRoles: [Role.ADMIN]})
  @put('/books/{id}')
  async update(
    @param.path.number('id') id: number,
    @requestBody() request: any,
  ): Promise<void> {
    const data = await bookSchema.validateAsync(request);
    await this.baseBookRepository.replaceById(id, data);
  }

  @authorize({allowedRoles: [Role.ADMIN]})
  @del('/books/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.baseEntryRepository.deleteAll({bookId: id});
    await this.baseBookRepository.deleteById(id);
  }
}
