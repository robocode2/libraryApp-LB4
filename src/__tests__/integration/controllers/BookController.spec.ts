

import {User} from '../../../models';
import {BaseBookRepository} from '../../../repositories';
import {Base} from '../../../repositories/keys';
import {ExpressServer} from '../../../server';
import {getJwtToken, givenEmptyDatabase, setupApplication} from '../../helpers';
import {CredentialsBuilder, ICredentials} from '../../helpers/builders';
import {BookPopulator, UserPopulator} from '../../helpers/populators';
import {Client, expect} from '../../helpers/test-modules';

describe('BookController', () => {
  let server: ExpressServer;
  let client: Client;
  let userPopulator: UserPopulator;
  let user: User;
  let userCredentials: ICredentials;
  let jwtToken: string;
  let baseBookRepository: BaseBookRepository;

  before('setupApplication', async () => {
    ({server, client} = await setupApplication());
  });

  after(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await givenEmptyDatabase();
    userPopulator = new UserPopulator(server.lbApp);
    userCredentials = new CredentialsBuilder().build();
    user = await userPopulator.withUsername(userCredentials.username).withPassword(userCredentials.password).populate();
    baseBookRepository = await server.lbApp.get(Base.Repository.BOOK);
    jwtToken = await getJwtToken(client, userCredentials);
  });


  describe('GET /books', () => {
    it('should successfully retrieve book with specified id', async () => {
      const book = await new BookPopulator(server.lbApp).populate();

      const response = await client
        .get(`/books`)
        .set('Authorization', `Bearer ${jwtToken}`);

      console.log(response)

      const books = await baseBookRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(200);
      expect(books).to.be.an('array').and.to.have.lengthOf(1);
      expect(books[0]).to.deep.equal(book)
    });
  });

});
