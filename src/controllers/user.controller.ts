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
import {OrmUser} from '../models';
import {BaseUserRepository} from '../repositories';
import { Base } from '../repositories/keys';

@injectable({ tags: { name: 'CreateUserController' } })
export class CreateUserControllerController {
  constructor(
    @inject(Base.Repository.USER) private baseUserRepository: BaseUserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'OrmUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrmUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrmUser, {
            title: 'NewOrmUser',
            
          }),
        },
      },
    })
    ormUser: OrmUser,
  ): Promise<OrmUser> {
    return this.baseUserRepository.create(ormUser);
  }

  @get('/users/count')
  @response(200, {
    description: 'OrmUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrmUser) where?: Where<OrmUser>,
  ): Promise<Count> {
    return this.baseUserRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of OrmUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrmUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrmUser) filter?: Filter<OrmUser>,
  ): Promise<OrmUser[]> {
    return this.baseUserRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'OrmUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrmUser, {partial: true}),
        },
      },
    })
    ormUser: OrmUser,
    @param.where(OrmUser) where?: Where<OrmUser>,
  ): Promise<Count> {
    return this.baseUserRepository.updateAll(ormUser, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'OrmUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrmUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OrmUser, {exclude: 'where'}) filter?: FilterExcludingWhere<OrmUser>
  ): Promise<OrmUser> {
    return this.baseUserRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'OrmUser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrmUser, {partial: true}),
        },
      },
    })
    ormUser: OrmUser,
  ): Promise<void> {
    await this.baseUserRepository.updateById(id, ormUser);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'OrmUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ormUser: OrmUser,
  ): Promise<void> {
    await this.baseUserRepository.replaceById(id, ormUser);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'OrmUser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.baseUserRepository.deleteById(id);
  }
}
