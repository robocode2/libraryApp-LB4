import { inject, injectable } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
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
import {OrmBook} from '../models';
import {BaseBookRepository} from '../repositories';
import { Base } from '../repositories/keys';

@injectable({ tags: { name: 'CreateBookController' } })
export class CreateBookControllerController {
  constructor(
    @inject(Base.Repository.BOOK) private baseBookRepository: BaseBookRepository,
  ) {}

  @post('/books')
  @response(200, {
    description: 'OrmBook model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrmBook)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrmBook, {
            title: 'NewOrmBook',
            
          }),
        },
      },
    })
    ormBook: OrmBook,
  ): Promise<OrmBook> {
    return this.baseBookRepository.create(ormBook);
  }

  @get('/books/count')
  @response(200, {
    description: 'OrmBook model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrmBook) where?: Where<OrmBook>,
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
          items: getModelSchemaRef(OrmBook, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrmBook) filter?: Filter<OrmBook>,
  ): Promise<OrmBook[]> {
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
          schema: getModelSchemaRef(OrmBook, {partial: true}),
        },
      },
    })
    ormBook: OrmBook,
    @param.where(OrmBook) where?: Where<OrmBook>,
  ): Promise<Count> {
    return this.baseBookRepository.updateAll(ormBook, where);
  }

  @get('/books/{id}')
  @response(200, {
    description: 'OrmBook model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrmBook, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OrmBook, {exclude: 'where'}) filter?: FilterExcludingWhere<OrmBook>
  ): Promise<OrmBook> {
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
          schema: getModelSchemaRef(OrmBook, {partial: true}),
        },
      },
    })
    ormBook: OrmBook,
  ): Promise<void> {
    await this.baseBookRepository.updateById(id, ormBook);
  }

  @put('/books/{id}')
  @response(204, {
    description: 'OrmBook PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ormBook: OrmBook,
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
