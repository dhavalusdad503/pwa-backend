import { AuthTokenPayload } from '@common/types';

export interface AuthRequest extends Request {
  user: AuthTokenPayload;
}
