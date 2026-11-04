export type UserRole = "customer" | "admin";

export type AuthUser = {
  userid: string;
  name: string;
  role: UserRole;
};

export type AuthUserResponse = { user: AuthUser | null };
