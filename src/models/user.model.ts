import {Entity, hasMany, model, property} from '@loopback/repository';
import {Role} from '../auth/domain/models';
import {List, OrmListWithRelations} from './list.model';

@model({
  settings: {strict: true, postgresql: {table: 'user'}},
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    enum: ['ADMIN', 'USER'],
    required: true,
    default: 'USER',
  })
  role: Role;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @hasMany(() => List, {keyTo: 'userId'})
  lists?: List[];


  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface OrmUserRelations {
  lists?: OrmListWithRelations[];
}

export type OrmUserWithRelations = User & OrmUserRelations;

