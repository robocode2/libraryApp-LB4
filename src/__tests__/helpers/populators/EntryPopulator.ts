import {LibraryApplication} from '../../../application';
import {OrmEntryWithRelations} from '../../../models';
import {Base} from '../../../repositories/keys';
import {EntryBuilder} from '../builders';

export class EntryPopulator {
  private entryBuilder: EntryBuilder;

  private readonly application: LibraryApplication;

  constructor(application: LibraryApplication) {
    this.entryBuilder = new EntryBuilder();
    this.application = application;
  }

  withBookId(value: number): this {
    this.entryBuilder.withBookId(value);
    return this;
  }

  withListId(value: number): this {
    this.entryBuilder.withListId(value);
    return this;
  }

  async populate(): Promise<OrmEntryWithRelations> {
    const ormEntry = this.entryBuilder.build();
    const baseEntryRepository = await this.application.get(Base.Repository.ENTRY);
    return baseEntryRepository.create(ormEntry);
  }
}
