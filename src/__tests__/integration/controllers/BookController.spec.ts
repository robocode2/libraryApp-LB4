

import {Role} from '../../../auth/domain/models';
import {User} from '../../../models';
import {BaseBookRepository, BaseEntryRepository} from '../../../repositories';
import {Base} from '../../../repositories/keys';
import {ExpressServer} from '../../../server';
import {getJwtToken, givenEmptyDatabase, setupApplication} from '../../helpers';
import {BookBuilder, CredentialsBuilder, ICredentials} from '../../helpers/builders';
import {BookPopulator, EntryPopulator, ListPopulator, UserPopulator} from '../../helpers/populators';
import {Client, expect} from '../../helpers/test-modules';

describe('BookController', () => {
  let server: ExpressServer;
  let client: Client;
  let normalUser: User;
  let normalUserCredentials: ICredentials;
  let normalJwtToken: string;
  let adminUserCredentials: ICredentials;
  let adminUser: User;
  let adminJwtToken: string;
  let baseBookRepository: BaseBookRepository;
  let baseEntryRepository: BaseEntryRepository;

  before('setupApplication', async () => {
    ({server, client} = await setupApplication());
  });

  after(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await givenEmptyDatabase();
    baseBookRepository = await server.lbApp.get(Base.Repository.BOOK);
    baseEntryRepository = await server.lbApp.get(Base.Repository.ENTRY);
    normalUserCredentials = new CredentialsBuilder().build();
    adminUserCredentials = new CredentialsBuilder()
      .withEmail('admin@test.de')
      .withUsername(`userCredentials.username` + 'Admin')
      .build();
    normalUser = await new UserPopulator(server.lbApp)
      .withUsername(normalUserCredentials.username)
      .withPassword(normalUserCredentials.password)
      .withRole(Role.USER)
      .populate();
    adminUser = await new UserPopulator(server.lbApp)
      .withUsername(adminUserCredentials.username)
      .withEmail(adminUserCredentials.email)
      .withPassword(adminUserCredentials.password)
      .withRole(Role.ADMIN)
      .populate();
    normalJwtToken = await getJwtToken(client, normalUserCredentials);
    adminJwtToken = await getJwtToken(client, adminUserCredentials);
  });


  describe('POST /books', () => {
    const book = new BookBuilder().build();
    it('should successfully create book as an admin', async () => {

      const response = await client
        .post(`/books`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .send(book);

      const books = await baseBookRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(200);
      expect(books).to.be.an('array').and.to.have.lengthOf(1);
      expect(books[0]).to.deep.include(book)
    });

    it('should reject creating book as a normal user', async () => {
      const response = await client
        .post(`/books`)
        .set('Authorization', `Bearer ${normalJwtToken}`)
        .send(book);

      expect(response.status).to.equal(403);
    });
  });

  describe('GET /books', () => {
    it('should successfully retrieve book with specified id', async () => {
      const book = await new BookPopulator(server.lbApp).populate();

      const response = await client
        .get(`/books`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      const books = await baseBookRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(200);
      expect(books).to.be.an('array').and.to.have.lengthOf(1);
      expect(books[0]).to.deep.equal(book)
    });
  });

  describe('DEL /books/{id}', () => {
    it('should reject deleting book if user is not an admin', async () => {
      const book = await new BookPopulator(server.lbApp).populate();

      const response = await client
        .del(`/books/${book.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      const books = await baseBookRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(403);
      expect(books).to.be.an('array').and.to.have.lengthOf(1);
      expect(books[0]).to.deep.equal(book)
    });

    it('should delete book successfully if user is an admin, then delete entries with book id', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(adminUser.id).populate();
      await new EntryPopulator(server.lbApp).withBookId(book.id).withListId(list.id).populate();

      const response = await client
        .del(`/books/${book.id}`)
        .set('Authorization', `Bearer ${adminJwtToken}`);

      const books = await baseBookRepository.find({order: ['id ASC']});
      const entries = await baseEntryRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(204);
      expect(books).to.be.an('array').and.to.have.lengthOf(0);
      expect(entries).to.be.an('array').and.to.have.lengthOf(0);
    });
  });

});
