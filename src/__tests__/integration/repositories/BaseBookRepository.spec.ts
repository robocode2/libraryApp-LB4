import {expect} from '@loopback/testlab';
import {BaseBookRepository} from '../../../repositories';
import {Base} from '../../../repositories/keys';
import {ExpressServer} from '../../../server';
import {setupApplication} from '../../helpers';
import {givenEmptyDatabase} from '../../helpers/databaseCleaner';
import {BookPopulator} from '../../helpers/populators';


describe('BookRepository (integration)', () => {
  let server: ExpressServer;
  let baseBookRepository: BaseBookRepository;


  before('setupApplication', async () => {
    ({server} = await setupApplication());
  });

  after(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await givenEmptyDatabase();
    baseBookRepository = await server.lbApp.get(Base.Repository.BOOK);
  });

  describe('findByName(name)', () => {
    it('return the correct category', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const found = await baseBookRepository.findById(1);

      expect(found).to.deepEqual(book);
    });
  });
});

