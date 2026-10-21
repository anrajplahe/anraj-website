
declare module "next-auth" {
  interface Session {
    githubId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: string;
  }
}

export {};
