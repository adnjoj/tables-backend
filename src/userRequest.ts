import { User } from './modules/users/entities/user.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user: User;
  }
}
