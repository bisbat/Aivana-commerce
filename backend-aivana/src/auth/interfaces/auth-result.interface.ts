import { SignInData } from './sign-in-data.interface';

export interface AuthResult {
  accessToken: string;
  user: SignInData;
}
