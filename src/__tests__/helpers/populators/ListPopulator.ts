import {LibraryApplication} from '../../../application';
import {OrmListWithRelations} from '../../../models';
import {Base} from '../../../repositories/keys';
import {ListBuilder} from '../builders';

export class ListPopulator {
  private listBuilder: ListBuilder;

  private readonly application: LibraryApplication;

  constructor(application: LibraryApplication) {
    this.listBuilder = new ListBuilder();
    this.application = application;
  }


  async populate(): Promise<OrmListWithRelations> {
    const ormList = this.listBuilder.build();
    const baseListRepository = await this.application.get(Base.Repository.LIST);
    return baseListRepository.create(ormList);
  }
}
