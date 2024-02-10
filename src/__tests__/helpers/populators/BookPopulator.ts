import {LibraryApplication} from '../../../application';
import {OrmBookWithRelations} from '../../../models';
import {Base} from '../../../repositories/keys';
import {BookBuilder} from '../builders';

export class BookPopulator {
  private bookBuilder: BookBuilder;

  private readonly application: LibraryApplication;

  constructor(application: LibraryApplication) {
    this.bookBuilder = new BookBuilder();
    this.application = application;
  }


  async populate(): Promise<OrmBookWithRelations> {
    const ormBook = this.bookBuilder.build();
    const baseBookRepository = await this.application.get(Base.Repository.BOOK);
    return baseBookRepository.create(ormBook);
  }
}
