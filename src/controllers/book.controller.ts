import { authenticate } from '@loopback/authentication';
import { inject, injectable } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Book} from '../models';
import {BaseBookRepository} from '../repositories';
import { Base } from '../repositories/keys';

@injectable({ tags: { name: 'CreateBookController' } })
@authenticate('jwt')
export class BookController {
  constructor(
    @inject(Base.Repository.BOOK) private baseBookRepository: BaseBookRepository,
  ) {}

  @post('/books')
  @response(200, {
    description: 'OrmBook model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewOrmBook',
            
          }),
        },
      },
    })
    ormBook: Book,
  ): Promise<Book> {
    return this.baseBookRepository.create(ormBook);
  }

  @get('/books/count')
  @response(200, {
    description: 'OrmBook model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.baseBookRepository.count(where);
  }

  @get('/books')
  @response(200, {
    description: 'Array of OrmBook model instances',
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
    console.log('here bin ich')
    return this.baseBookRepository.find(filter);
  }

  @patch('/books')
  @response(200, {
    description: 'OrmBook PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    ormBook: Book,
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.baseBookRepository.updateAll(ormBook, where);
  }

  @get('/books/{id}')
  @response(200, {
    description: 'OrmBook model instance',
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

  @patch('/books/{id}')
  @response(204, {
    description: 'OrmBook PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    ormBook: Book,
  ): Promise<void> {
    await this.baseBookRepository.updateById(id, ormBook);
  }

  @put('/books/{id}')
  @response(204, {
    description: 'OrmBook PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ormBook: Book,
  ): Promise<void> {
    await this.baseBookRepository.replaceById(id, ormBook);
  }

  @del('/books/{id}')
  @response(204, {
    description: 'OrmBook DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.baseBookRepository.deleteById(id);
  }
}
