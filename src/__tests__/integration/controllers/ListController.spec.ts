

import {Role} from '../../../auth/domain/models';
import {User} from '../../../models';
import {BaseBookRepository, BaseEntryRepository, BaseListRepository} from '../../../repositories';
import {Base} from '../../../repositories/keys';
import {ExpressServer} from '../../../server';
import {getJwtToken, givenEmptyDatabase, setupApplication} from '../../helpers';
import {CredentialsBuilder, ICredentials, ListBuilder} from '../../helpers/builders';
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
  let baseBookRepository: BaseBookRepository;
  let baseEntryRepository: BaseEntryRepository;
  let baseListRepository: BaseListRepository;

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
    baseListRepository = await server.lbApp.get(Base.Repository.LIST);

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


  describe('POST /lists', () => {
    it('should successfully create list', async () => {
      const list = new ListBuilder().build();

      const response = await client
        .post(`/lists`)
        .set('Authorization', `Bearer ${normalJwtToken}`)
        .send({name: list.name, description: list.description});


      const lists = await baseListRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(200);
      expect(lists).to.be.an('array').and.to.have.lengthOf(1);
      expect(lists[0]).to.deep.include({...list, userId: normalUser.id})
    });
  });

  describe('DELETE /lists/{id}', () => {
    it('should successfully delete list if it belongs to user', async () => {
      const book = await new BookPopulator(server.lbApp).populate();
      const list = await new ListPopulator(server.lbApp).withUserId(normalUser.id).populate();
      await new EntryPopulator(server.lbApp).withBookId(book.id).withListId(list.id).populate();

      const response = await client
        .del(`/lists/${list.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      const lists = await baseListRepository.find({order: ['id ASC']});
      const entries = await baseEntryRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(204);
      expect(lists).to.be.an('array').and.to.have.lengthOf(0);
      expect(entries).to.be.an('array').and.to.have.lengthOf(0);
    });

    it('should reject deleting list if it doesnt belong to user', async () => {
      const list = await new ListPopulator(server.lbApp).withUserId('fc9e6df5-8bbc-444b-be8a-8ee1594b81aa').populate();

      const response = await client
        .del(`/lists/${list.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      expect(response.status).to.equal(403);
    });

    it('should reject deleting list if it doesnt belong to user as an admin?', async () => { //TODOX same error verifying token
      const list = await new ListPopulator(server.lbApp).withUserId('fc9e6df5-8bbc-444b-be8a-8ee1594b81aa').populate();

      const response = await client
        .del(`/lists/${list.id}`)
        .set('Authorization', `Bearer ${adminJwtToken}`);

      expect(response.status).to.equal(401);
    });
  });


  describe('GET /lists/{id}', () => {
    it('should successfully get list if it belongs to user', async () => {
      const list = await new ListPopulator(server.lbApp).withUserId(normalUser.id).populate();

      const response = await client
        .get(`/lists/${list.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      const lists = await baseListRepository.find({order: ['id ASC']});

      expect(response.status).to.equal(200);
      expect(lists).to.be.an('array').and.to.have.lengthOf(1);
    });

    it('should reject getting list if it doesnt belong to user', async () => {
      const list = await new ListPopulator(server.lbApp).withUserId('fc9e6df5-8bbc-444b-be8a-8ee1594b81aa').populate();

      const response = await client
        .get(`/lists/${list.id}`)
        .set('Authorization', `Bearer ${normalJwtToken}`);

      console.log(response)
      expect(response.status).to.equal(403); //TODOX add error, Access denied
    });

    it('should reject getting list if it doesnt belong to user as an admin?', async () => { //TODOX jwt malformed :/ ?
      const list = await new ListPopulator(server.lbApp).withUserId('fc9e6df5-8bbc-444b-be8a-8ee1594b81aa').populate();

      const response = await client
        .get(`/lists/${list.id}`)
        .set('Authorization', `Bearer ${adminJwtToken}`);

      expect(response.status).to.equal(401);
    });
  });

});
