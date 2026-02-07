import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            role?: string;
        } & DefaultSession["user"];
    }

    interface User {
        firstName?: string | null;
        lastName?: string | null;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        firstName?: string | null;
        lastName?: string | null;
        role?: string;
    }
}
