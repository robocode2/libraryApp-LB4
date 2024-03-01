import {User} from '@loopback/authentication-jwt';
import {Book, Entry, List} from '../../../models';

export class ListBuilder {
  private values: Partial<List> = {
    name: 'Test list',
    description: 'my favourites books',
    userId: 'FaAMohHFTwftFrApJnjcEt640k92',
  };

  private user?: User;
  private entries?: Entry[];
  private books?: Book[];


  withUserId(value?: string): this {
    this.values.userId = value;
    return this;
  }

  build(): List {
    return new List(this.values);
  }
}
