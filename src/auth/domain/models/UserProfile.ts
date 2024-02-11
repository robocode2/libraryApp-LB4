import {securityId} from '@loopback/security';
import {Role} from './Role';

export interface UserProfile {
  [securityId]: string;
  id: string;
  username: string;
  email?: string;
  role: Role;
}
