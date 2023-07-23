import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Book, OrmBookWithRelations} from './book.model';
import {List, OrmListWithRelations} from './list.model';

@model({
  settings: {strict: true, postgresql: {table: 'entry'}},
})
export class Entry extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @belongsTo(
    () => Book,
    {},
    {
      name: 'bookId',
      required: true
    },
  )
  bookId: number;

  @belongsTo(
    () => List,
    {},
    {
      name: 'listId',
      required: true
    },
  )
  listId: number;

  constructor(data?: Partial<Entry>) {
    super(data);
  }
}
  //TODOX double check all relations
  export interface OrmEntryRelations {
    // describe navigational properties here
    book?: OrmBookWithRelations;
    list?: OrmListWithRelations;
  }
  export type OrmEntryWithRelations = Entry & OrmEntryRelations;


