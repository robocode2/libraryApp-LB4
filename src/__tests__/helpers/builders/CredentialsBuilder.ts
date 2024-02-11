export interface ICredentials {
  username: string;
  password: string;
  email: string;
}

export class CredentialsBuilder {
  private values: ICredentials = {
    username: 'user',
    password: 'user-test',
    email: 'user@test.co'
  };

  withUsername(value: string): this {
    this.values.username = value;
    this.values.email = value;
    return this;
  }

  withEmail(value: string): this {
    this.values.username = value;
    this.values.email = value;
    return this;
  }

  withPassword(value: string): this {
    this.values.password = value;
    return this;
  }

  asIntegration(): this {
    this.values.username = 'integration@test.de';
    this.values.email = 'integration@test.de';
    this.values.password = 'integration-test';
    return this;
  }

  build(): ICredentials {
    return this.values;
  }
}
