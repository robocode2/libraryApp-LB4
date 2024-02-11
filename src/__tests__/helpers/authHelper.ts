import {Credentials} from '../../models';
import {Client} from './test-modules';

async function getJwtToken(client: Client, userCredentials: Credentials) {
  const loginResponse = await client.post('/users/login').send(userCredentials);
  return loginResponse.body.token;
}

export {getJwtToken};

