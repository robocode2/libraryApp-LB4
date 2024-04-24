import {authenticate, TokenService} from '@loopback/authentication';
import {Credentials, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject, injectable} from '@loopback/core';
import {
  get,
  post,
  requestBody,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {User} from '../models';
import {BaseUserRepository} from '../repositories';
import {Base} from '../repositories/keys';
import {userSchema} from '../schemas';
import {MyUserService} from '../services/MyUserService';


const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};




@injectable({tags: {name: 'UserController'}})
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(Base.Repository.USER) private baseUserRepository: BaseUserRepository,
  ) { }

  async checkEmailIsUsed(userEmail: string): Promise<void> {
    const user = await this.baseUserRepository.findOne({where: {email: userEmail}});
    if (user) {
      throw new Error('Error happened. Registering not allowed with this email or username. Check with admins');
    }
  }

  async checkUsernameIsUsed(username: string): Promise<void> {
    const user = await this.baseUserRepository.findOne({where: {username}});
    if (user) {
      throw new Error('Error happened. Registering not allowed with this email or username. Check with admins');
    }
  }

  @post('/users/login')
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI')
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup')
  async signUp(
    @requestBody() request: any,
  ): Promise<User> {
    const requestData = await userSchema.validateAsync(request);
    await this.checkEmailIsUsed(requestData.email);
    await this.checkUsernameIsUsed(requestData.username);

    const password = await hash(requestData.password, await genSalt());
    const userWithHashedPassword = {
      ..._.omit(requestData, 'password'),
      password: password,
    };
    const savedUser = await this.baseUserRepository.create(
      userWithHashedPassword);

    return savedUser;
  }
}
