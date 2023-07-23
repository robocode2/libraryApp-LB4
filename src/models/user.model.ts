import { UserCredentials } from '@loopback/authentication-jwt';
import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import { List, OrmListWithRelations } from './list.model';

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

/*   @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number; */

  @property({
    type: 'string',
    required: true,
  })
  username: string;

 // must keep it
 // feat email unique
  @property({
    type: 'string',
      required: true,
      index: { //TODO read up
        unique: true,
      },
    })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
 
  @property({
      type: 'string',
  })
  verificationToken?: string;
  
/*   @hasOne(() => UserCredentials, { keyTo: 'userId' })
  userCredential: UserCredentials;

 */
  @hasMany(() => List, { keyTo: 'userId' }) //TODO userId or id ?
  lists?: List[];

  //TODO hasMany books ? Can anyone delete a book entity ? 

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface OrmUserRelations {
  // describe navigational properties here
  lists?: OrmListWithRelations[];
 // credential: UserCredentials;
  //TODO books ?
}

export type OrmUserWithRelations = User & OrmUserRelations;
