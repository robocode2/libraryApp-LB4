import {Book, Entry, List} from '../../../models';

export class EntryBuilder {
  private values: Partial<Entry> = {
    bookId: 1,
    listId: 1
  };

  private list?: List;
  private book?: Book;


  withBookId(value?: number): this {
    this.values.bookId = value;
    return this;
  }


  withListId(value?: number): this {
    this.values.listId = value;
    return this;
  }


  build(): Entry {
    const ormEntry = new Entry(this.values);
    return ormEntry;
  }
}
