import { z } from "zod";
import { insertUserSchema, users, clans } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

const userWithoutPassword = z.object({
  id: z.number(),
  username: z.string(),
  balance: z.number().default(0),
  realBalance: z.number().default(0),
  clan: z.string().nullable().optional(),
  rank: z.string().nullable().optional(),
  role: z.string().optional(),
  kills: z.number().default(0),
  deaths: z.number().default(0),
  minecraftUuid: z.string().nullable().optional(),
});

export const api = {
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: userWithoutPassword,
        401: errorSchemas.unauthorized,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: insertUserSchema,
      responses: {
        200: userWithoutPassword,
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: userWithoutPassword,
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  clans: {
    list: {
      method: 'GET' as const,
      path: '/api/clans' as const,
      responses: {
        200: z.array(z.custom<typeof clans.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
