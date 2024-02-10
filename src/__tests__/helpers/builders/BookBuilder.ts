import {Book, Entry, List} from '../../../models';

export class BookBuilder {
  private values: Partial<Book> = {
    title: 'Jane Eyre',
    isbn: '1231421251212',
    description: 'my favourite book',
  };

  private lists?: List[];
  private entry?: Entry;

  build(): Book {
    const ormBook = new Book(this.values);

    if (this.lists) {
      ormBook.lists = this.lists;
    }

    return ormBook;
  }
}
