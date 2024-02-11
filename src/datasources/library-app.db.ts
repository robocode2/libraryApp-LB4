import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';


const mainConfig = {
  name: 'libraryapp_dev',
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  url: 'postgres://postgres:IDnowLOV123@127.0.0.1:5432/libraryapp_dev', //TODOX this was the key
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_DEV_SCHEMA
};

const testConfig = {
  name: 'libraryapp_test',
  connector: 'postgresql',
  host: process.env.DB_HOST,
  database: process.env.DB_TEST_SCHEMA,
  port: process.env.DB_PORT,
  url: 'postgres://postgres:IDnowLOV123@127.0.0.1:5432/libraryapp_test',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
};

// this is the important part
const config = process.env.NODE_ENV === 'test' ? testConfig : mainConfig;


// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class LibraryAppDb extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'libraryApp';
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config. + ${config.name}`, {optional: true})
    dsConfig: object = config
  ) {
    super(dsConfig);
  }
}
