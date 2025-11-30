import type { User as AppUser } from './entities/User';

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
