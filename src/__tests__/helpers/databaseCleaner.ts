
import {LibraryAppDb} from '../../datasources';

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
}
