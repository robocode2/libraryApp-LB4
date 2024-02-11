
import {LibraryAppDb} from '../../datasources';
import {BaseBookRepository, BaseEntryRepository, BaseListRepository, BaseUserRepository} from '../../repositories';

const db = new LibraryAppDb();


export async function givenEmptyDatabase() {
  const tablesToBeCleaned = ['book', 'entry', 'list']; //TODOX adding user returns a problem

  let deleteBlock = '';
  for (const tableName of tablesToBeCleaned) {
    deleteBlock += `DELETE FROM ${tableName};`;
    deleteBlock += `ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1;`; // probably has to do with the id
  }

  const deletionQuery = `TRUNCATE ${tablesToBeCleaned.join(',')} RESTART IDENTITY CASCADE;`;
  await db.execute(deletionQuery, []);


  //TODOX improve
  const baseBookRepository: BaseBookRepository = new BaseBookRepository(
    new LibraryAppDb,
    async () => baseEntryRepository,
    async () => baseListRepository,
  );

  const baseListRepository: BaseListRepository = new BaseListRepository(
    new LibraryAppDb,
    async () => baseUserRepository,
    async () => baseEntryRepository,
    async () => baseBookRepository,
  );


  const baseEntryRepository: BaseEntryRepository = new BaseEntryRepository(
    new LibraryAppDb,
    async () => baseBookRepository,
    async () => baseListRepository,
  );


  const baseUserRepository: BaseUserRepository = new BaseUserRepository(
    new LibraryAppDb,
    async () => baseListRepository,
  );

  await baseUserRepository.deleteAll();
}
