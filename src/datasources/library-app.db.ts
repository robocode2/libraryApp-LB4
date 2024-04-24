import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';


const mainConfig = {
  name: process.env.DEV_DB,
  connector: process.env.DB_CONNECTOR,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  url: process.env.DB_DEV_URL,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DEV_DB
};

const testConfig = {
  name: process.env.TEST_DB_NAME,
  connector: process.env.DB_CONNECTOR,
  host: process.env.DB_HOST,
  database: process.env.DB_TEST,
  port: process.env.DB_PORT,
  url: process.env.DB_TEST_URL,
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
