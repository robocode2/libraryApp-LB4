import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'libraryapp_dev',
  connector: 'postgresql',
  url: 'postgres://postgres:myNewPassword@127.0.0.1:5432/libraryapp_dev',
  host: 'localhost',
  port: +(process.env.DB_PORT ?? 5432),
  user: 'postgres',
  password: 'myNewPassword',
  //database: process.env.DB_SCHEMA
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class LibraryAppDb extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'libraryApp';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.libraryapp_dev', { optional: true })
    dsConfig: object = config
  ) {
    super(dsConfig);
  }
}