import {Entity, hasMany, model, property} from '@loopback/repository';
import { OrmEntry, OrmEntryWithRelations } from './orm-entry.model';
import { OrmList, OrmListWithRelations } from './orm-list.model';
import { OrmUser, OrmUserWithRelations } from './orm-user.model'; //TODO do I want a creator ?

@model({
  settings: {strict: true, postgresql: {table: 'book'}},
})
//TODO mysql?
export class OrmBook extends Entity {
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

  @hasMany(() => OrmEntry, { keyTo: 'bookId' })
  entries?: OrmEntry[];

  @hasMany(() => OrmList, {
    through: {
      model: () => OrmEntry,
      keyFrom: 'id',
      keyTo: 'bookId'
    }
  })
  lists?: OrmList[];
  

  constructor(data?: Partial<OrmBook>) {
    super(data);
  }
}

  //TODOX double check all relations
  export interface OrmBookRelations {
    // describe navigational properties here
    lists?: OrmListWithRelations[]; //through entries
    entries?: OrmEntryWithRelations[];

  }
  export type OrmBookWithRelations = OrmBook & OrmBookRelations;

