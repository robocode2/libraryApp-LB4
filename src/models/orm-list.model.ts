import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import { OrmBook, OrmBookWithRelations } from './orm-book.model';
import { OrmEntry, OrmEntryWithRelations } from './orm-entry.model';
import { OrmUser, OrmUserWithRelations } from './orm-user.model';

@model({
  settings: {strict: true, postgresql: {table: 'list'}},
})
export class OrmList extends Entity {
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
    () => OrmUser,
    {},
    {
      name: 'userId',
      required: true
    },
  )
  userId: number;


@hasMany(() => OrmEntry, { keyTo: 'listId' })
entries?: OrmEntry[];


@hasMany(() => OrmBook, {
  through: {
    model: () => OrmEntry,
    keyFrom: 'id',
    keyTo: 'listId'
  }
})
books?: OrmBook[];


  constructor(data?: Partial<OrmList>) {
    super(data);
  }
}

//TODOX double check all relations
  export interface OrmListRelations {
    // describe navigational properties here
    books?: OrmBookWithRelations[];
    entries?: OrmEntryWithRelations[];
    user?: OrmUserWithRelations[]
  }
  export type OrmListWithRelations = OrmList & OrmListRelations;


