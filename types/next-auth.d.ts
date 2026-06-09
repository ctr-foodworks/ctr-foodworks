import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/db/schema";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    mustChangePassword?: boolean;
  }
  interface Session {
    user: {
      role?: UserRole;
      mustChangePassword?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    mustChangePassword?: boolean;
  }
}
