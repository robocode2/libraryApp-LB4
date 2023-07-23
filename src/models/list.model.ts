import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import { Book, OrmBookWithRelations } from './book.model';
import { Entry, OrmEntryWithRelations } from './entry.model';
import { User, OrmUserWithRelations } from './user.model';

@model({
  settings: {strict: true, postgresql: {table: 'list'}},
})
export class List extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @belongsTo(
    () => User,
    {},
    {
      name: 'userId',
      required: true
    },
  )
  userId: string;


@hasMany(() => Entry, { keyTo: 'listId' })
entries?: Entry[];


@hasMany(() => Book, {
  through: {
    model: () => Entry,
    keyFrom: 'id',
    keyTo: 'listId'
  }
})
books?: Book[];


  constructor(data?: Partial<List>) {
    super(data);
  }
}

//TODOX double check all relations
  export interface OrmListRelations {
    // describe navigational properties here
    books?: OrmBookWithRelations[];
    entries?: OrmEntryWithRelations[];
  }
  export type OrmListWithRelations = List & OrmListRelations;


