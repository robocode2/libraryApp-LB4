import {User} from '@loopback/authentication-jwt';
import {Book, Entry, List} from '../../../models';

export class ListBuilder {
  private values: Partial<List> = {
    name: 'My first list',
    description: 'my favourites books',
    userId: 'FaAMohHFTwftFrApJnjcEt640k92',
  };

  private user?: User;
  private entries?: Entry[];
  private books?: Book[];

  build(): List {
    const ormList = new List(this.values);

    return ormList;
  }
}
