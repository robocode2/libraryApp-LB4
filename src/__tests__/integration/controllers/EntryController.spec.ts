

import {Role} from '../../../auth/domain/models';
import {User} from '../../../models';
import {BaseEntryRepository} from '../../../repositories';
import {Base} from '../../../repositories/keys';
import {ExpressServer} from '../../../server';
import {getJwtToken, givenEmptyDatabase, setupApplication} from '../../helpers';
import {CredentialsBuilder, ICredentials} from '../../helpers/builders';
import {BookPopulator, EntryPopulator, ListPopulator, UserPopulator} from '../../helpers/populators';
import {Client, expect} from '../../helpers/test-modules';

describe('ListController', () => {
  let server: ExpressServer;
  let client: Client;
  let normalUser: User;
  let normalUserCredentials: ICredentials;
  let normalJwtToken: string;
  let adminUserCredentials: ICredentials;
  let adminUser: User;
  let adminJwtToken: string;
  let baseEntryRepository: BaseEntryRepository;

  before('setupApplication', async () => {
    ({server, client} = await setupApplication());
  });

  after(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await givenEmptyDatabase();
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


  describe('POST /lists/{listId}/entries', () => {
    it('should successfully create entry if user owns list', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(normalUser.id).populate();

      const response = await client
        .post(`/lists/${list.id}/entries`)
        .set('Authorization', `Bearer ${normalJwtToken}`)
        .send({bookId: book.id, listId: list.id});

      const entries = await baseEntryRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(200);
      expect(entries).to.be.an('array').and.to.have.lengthOf(1);
      expect(entries[0]).to.deep.equal({id: 1, bookId: book.id, listId: list.id})
    });

    it('should reject creating entry if user does not own list', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(adminUser.id).populate();

      const response = await client
        .post(`/lists/${list.id}/entries`)
        .set('Authorization', `Bearer ${normalJwtToken}`)
        .send({bookId: book.id, listId: list.id});

      expect(response.status).to.equal(403);
    });
  });

  describe('DELETE /lists/{listId}/entries/{entryId}', () => {
    it('should successfully delete entry if user owns list', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(normalUser.id).populate();
      const entry = await new EntryPopulator(server.lbApp).withBookId(book.id).withListId(list.id).populate();

      const response = await client
        .del(`/lists/${list.id}/entries/${entry.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`)

      const entries = await baseEntryRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(204);
      expect(entries).to.be.an('array').and.to.have.lengthOf(0);
    });

    it('should reject deleting entry if user does not own list', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(adminUser.id).populate();
      const entry = await new EntryPopulator(server.lbApp).withBookId(book.id).withListId(list.id).populate();

      const response = await client
        .del(`/lists/${list.id}/entries/${entry.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`)

      expect(response.status).to.equal(403);
    });
  });


  describe('GET /lists/{listId}/entries', () => {
    it('should successfully get list entries if list belongs to user', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(normalUser.id).populate();
      const entry = await new EntryPopulator(server.lbApp).withBookId(book.id).withListId(list.id).populate();

      const response = await client
        .get(`/lists/${list.id}/entries`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').and.to.have.lengthOf(1);
      expect(response.body).to.deep.equal([entry]);

    });

    it.only('should reject getting list entries if list doesnt belong to user', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(adminUser.id).populate();
      const entry = await new EntryPopulator(server.lbApp).withBookId(book.id).withListId(list.id).populate();

      const response = await client
        .get(`/lists/${list.id}/entries`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      expect(response.status).to.equal(403);
    });
  });

});
