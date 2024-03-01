import {hashSync} from 'bcryptjs';
import {LibraryApplication} from '../../../application';
import {Role} from '../../../auth/domain/models';
import {User} from '../../../models';
import {Credentials} from '../../../models/credentials.model';
import {Base} from '../../../repositories/keys';

export class UserPopulator {
  private application: LibraryApplication;
  private username = 'user';
  private password?: string;
  private email = 'user@test.co';
  private role?: Role


  constructor(application: LibraryApplication) {
    this.application = application;
  }

  withUsername(value: string): this {
    this.username = value;
    return this;
  }

  withPassword(value?: string): this {
    this.password = value;
    return this;
  }


  withEmail(value: string): this {
    this.email = value;
    return this;
  }

  withCredentials(credentials: Credentials): this {
    this.username = credentials.username;
    this.password = credentials.password;
    this.email = credentials.username;
    return this;
  }

  withRole(value: Role): this {
    this.role = value;
    return this;
  }

  async populate(): Promise<User> {
    const ormUser = new User({
      username: this.username,
      email: this.email,
      password: this.password ? hashSync(this.password, 10) : undefined,
      role: this.role
    });

    const baseUserRepository = await this.application.get(Base.Repository.USER);
    const user = await baseUserRepository.create(ormUser);
    const userInstance = await baseUserRepository.findById(user.id);
    return userInstance;
  }
}
