import {Entity, hasMany, model, property} from '@loopback/repository';
import { Entry, OrmEntryWithRelations } from './entry.model';
import { List, OrmListWithRelations } from './list.model';
import { User, OrmUserWithRelations } from './user.model'; //TODO do I want a creator ?

@model({
  settings: {strict: true, postgresql: {table: 'book'}},
})
//TODO mysql?
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    updateOnly: true, //TODO What does this mean ?
  })
  id: number; //TODO ids optional or not ? use Id or ISBN?

  @property({
    type: 'string',
    required: true,
  })
  title?: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    required: false,
  })
  isbn?: string;

  @hasMany(() => Entry, { keyTo: 'bookId' })
  entries?: Entry[];

  @hasMany(() => List, {
    through: {
      model: () => Entry,
      keyFrom: 'id',
      keyTo: 'bookId'
    }
  })
  lists?: List[];
  

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

  //TODOX double check all relations
  export interface OrmBookRelations {
    // describe navigational properties here
    lists?: OrmListWithRelations[]; //through entries
    entries?: OrmEntryWithRelations[];

  }
  export type OrmBookWithRelations = Book & OrmBookRelations;

