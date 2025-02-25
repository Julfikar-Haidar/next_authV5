import { DefaultSession } from "next-auth";
import "next-auth/jwt";

interface AuthUser {
  code: string;
  success: boolean;
  message: string;
  data: Data;
}
declare module "next-auth" {
  type User = IUser;

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: IUser;
    access_token?: string;
    refresh_token?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    access_token: string;
    refresh_token: string;
    error?: string;
  }
}
