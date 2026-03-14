import { z } from "zod";
import { insertUserSchema, users, clans, insertGriefReportSchema } from "./schema";

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
    generateCode: {
      method: 'POST' as const,
      path: '/api/auth/code/generate' as const,
      responses: {
        200: z.object({ code: z.string() }),
        401: errorSchemas.unauthorized,
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
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(userWithoutPassword),
      },
    },
    byUsername: {
      method: 'GET' as const,
      path: '/api/users/:username' as const,
      responses: {
        200: userWithoutPassword,
        404: errorSchemas.notFound,
      },
    },
  },
  grief: {
    create: {
      method: 'POST' as const,
      path: '/api/grief-reports' as const,
      input: insertGriefReportSchema,
      responses: {
        201: z.object({ success: z.boolean(), id: z.number() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/grief-reports' as const,
      responses: {
        200: z.array(z.any()), // GriefReport[]
        401: errorSchemas.unauthorized,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/grief-reports/:id/status' as const,
      input: z.object({ status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']) }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  tournament: {
    list: {
      method: 'GET' as const,
      path: '/api/tournament/matches' as const,
      responses: {
        200: z.array(z.any()), // TournamentMatch[]
      },
    },
    updateMatch: {
      method: 'PATCH' as const,
      path: '/api/tournament/matches/:id' as const,
      input: z.object({
        player1: z.string().nullable().optional(),
        player2: z.string().nullable().optional(),
        winner: z.number().nullable().optional(),
        status: z.enum(['pending', 'live', 'completed']).optional(),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/tournament/reset' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
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
