import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {AuthorizationBindings, AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {OwnListOnlyUseCase} from './auth/application/useCases';
import {AuthorizationService, ListAccessService} from './auth/domain/services';
import {AuthorizationProvider} from './auth/infrastructure/providers';
import {OwnListOnlyVoter} from './auth/infrastructure/voters/OwnListVoter';
import {Auth} from './auth/keys';
import {LibraryAppDb} from './datasources';
import {BaseUserRepository} from './repositories';
import {MySequence} from './sequence';
import {MyUserService} from './services/MyUserService';
import path = require('path');

export {ApplicationConfig};

export class LibraryApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(LibraryAppDb, UserServiceBindings.DATASOURCE_NAME);

    //Bind repository
    this.repository(BaseUserRepository);
    // Bind user service
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService),
      // Bind user and credentials repository
      this.bind(UserServiceBindings.USER_REPOSITORY).toClass(
        BaseUserRepository,
      )

    const authOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    // Mount auth
    // I remember simething about the order of these bindings or the above bindings being essential
    this.component(AuthorizationComponent);
    this.configure(AuthorizationBindings.COMPONENT).to(authOptions);
    this.bind('auth.services.authorization').toClass(AuthorizationService);
    this.bind(Auth.Provider.AUTHORIZATION_PROVIDER).toProvider(AuthorizationProvider).tag(AuthorizationTags.AUTHORIZER);

    this.bind('auth.useCases.ownListOnly').toClass(OwnListOnlyUseCase);
    this.bind('auth.services.listAccess').toClass(ListAccessService);
    this.bind(Auth.Voter.OWN_LIST_ONLY).toProvider(OwnListOnlyVoter);


    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
      repositories: {
        glob: '/repositories/*Repository.js'
      },
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      datasources: {
        glob: '/datasources/**/*.db.js'
      },

      services: {
        // includes context services, use cases and repositories
        glob: '/{bffs,contexts,shared}/**/*{ervice,UseCase,epository,Delegator}.js'
      },
    };
  }
}
