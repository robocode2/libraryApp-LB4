import {Entity, hasMany, model, property} from '@loopback/repository';
import {Entry, OrmEntryWithRelations} from './entry.model';
import {List, OrmListWithRelations} from './list.model';

@model({
  settings: {strict: true, postgresql: {table: 'book'}},
})
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    updateOnly: true,
  })
  id: number;

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

  @hasMany(() => Entry, {keyTo: 'bookId'})
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

export interface OrmBookRelations {
  // describe navigational properties here
  lists?: OrmListWithRelations[];
  entries?: OrmEntryWithRelations[];

}
export type OrmBookWithRelations = Book & OrmBookRelations;

