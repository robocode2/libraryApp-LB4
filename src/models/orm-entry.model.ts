import {belongsTo, Entity, model, property} from '@loopback/repository';
import {OrmBook, OrmBookWithRelations} from './orm-book.model';
import {OrmList, OrmListWithRelations} from './orm-list.model';

@model({
  settings: {strict: true, postgresql: {table: 'entry'}},
})
export class OrmEntry extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @belongsTo(
    () => OrmBook,
    {},
    {
      name: 'bookId',
      required: true
    },
  )
  bookId: number;

  @belongsTo(
    () => OrmList,
    {},
    {
      name: 'listId',
      required: true
    },
  )
  listId: number;

  constructor(data?: Partial<OrmEntry>) {
    super(data);
  }
}
  //TODOX double check all relations
  export interface OrmEntryRelations {
    // describe navigational properties here
    book?: OrmBookWithRelations;
    list?: OrmListWithRelations;
  }
  export type OrmEntryWithRelations = OrmEntry & OrmEntryRelations;


