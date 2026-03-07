import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// For Vercel, we need to export the app directly without async wrapper
// Or ensure routes are registered before export.
// Since registerRoutes is async, we can't make top-level await work everywhere easily.
// But we can attach routes.

// Modifying registerRoutes to be synchronous or handle async internally if possible,
// OR simply call it and hope it resolves quickly (bad practice but common).
// BETTER APPROACH: Export a function that Vercel calls, or use a pattern where app is fully configured.

// Let's make registerRoutes setup the app immediately.
(async () => {
  try {
    // Setup routes
    await registerRoutes(httpServer, app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Internal Server Error:", err);
      if (res.headersSent) return;
      res.status(status).json({ message });
    });

    // Static files and Vite
    if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    } else if (process.env.VERCEL !== "1") {
      // Production mode on VPS
      serveStatic(app);
    }

    // Start server
    const port = parseInt(process.env.PORT || "5000", 10);
    const isVercel = process.env.VERCEL === "1";

    if (!isVercel) {
      httpServer.listen(
        {
          port,
          host: "0.0.0.0",
        },
        () => {
          log(`serving on port ${port}`);
        },
      );
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

export default app;
