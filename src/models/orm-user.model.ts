import {Entity, hasMany, model, property} from '@loopback/repository';
import { OrmList, OrmListWithRelations } from './orm-list.model';

@model({
  settings: {strict: true, postgresql: {table: 'user'}},
})
export class OrmUser extends Entity {
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
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

/*   @property({
    type: 'string',
    generated: true,
  })
  salt: string; */

  @hasMany(() => OrmList, { keyTo: 'userId' }) //TODO userId or id ?
  lists?: OrmList[];

  //TODO hasMany books ? Can anyone delete a book entity ? 



  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrmUser>) {
    super(data);
  }
}

export interface OrmUserRelations {
  // describe navigational properties here
  lists?: OrmListWithRelations[];
  //TODO books ?
}

export type OrmUserWithRelations = OrmUser & OrmUserRelations;
