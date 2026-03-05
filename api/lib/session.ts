import { SessionOptions } from "iron-session";

declare module "iron-session" {
  interface SessionData {
    userId?: number;
  }
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "skviirtl_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
