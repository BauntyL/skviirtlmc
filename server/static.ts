import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  // Более надежный способ определения пути для скомпилированного бандла
  let distPath = path.resolve(process.cwd(), "dist");
  
  // Если запустили не из корня или папка не там (для dev режима)
  if (!fs.existsSync(distPath)) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      distPath = path.resolve(__dirname, "..", "dist");
    } catch (e) {
      // Игнорируем ошибку, если import.meta.url недоступен
    }
  }

  if (!fs.existsSync(distPath)) {
    console.error(`ERROR: Static directory not found at ${distPath}`);
    // Не кидаем фатальную ошибку сразу, чтобы сервер не уходил в бесконечный рестарт
    return;
  }

  app.use(express.static(distPath));

  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
