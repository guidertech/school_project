import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: "school" | "student";
    school_id?: string | number;
    school_name?: string;
    gmail?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: "school" | "student";
      school_id?: string | number;
      school_name?: string;
      gmail?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "school" | "student";
    school_id?: string | number;
    school_name?: string;
    gmail?: string;
  }
}
