import { IronSessionOptions } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    userId?: number;
  }
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "skviirtl_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Define session data type
declare module "iron-session" {
  interface IronSessionData {
    userId?: number;
  }
}