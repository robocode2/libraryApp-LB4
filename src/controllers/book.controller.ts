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
  getModelSchemaRef,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Role} from '../auth/domain/models';
import {Book} from '../models';
import {BaseBookRepository} from '../repositories';
import {Base} from '../repositories/keys';


@injectable({tags: {name: 'BookController'}}) //TODO why are my controllers injectable ?
@authenticate('jwt')
export class BookController {
  constructor(
    @inject(Base.Repository.BOOK) private baseBookRepository: BaseBookRepository,
  ) { }

  @authorize({allowedRoles: [Role.ADMIN]})
  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',

          }),
        },
      },
    })
    book: Book,
  ): Promise<Book> {
    return this.baseBookRepository.create(book);
  }

  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<Book[]> {
    return this.baseBookRepository.find(filter);
  }


  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, {exclude: 'where'}) filter?: FilterExcludingWhere<Book>
  ): Promise<Book> {
    return this.baseBookRepository.findById(id, filter);
  }

  @put('/books/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() book: Book,
  ): Promise<void> {
    await this.baseBookRepository.replaceById(id, book);
  }

  @del('/books/{id}') //TODO dangerous
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.baseBookRepository.deleteById(id);
  }
}
