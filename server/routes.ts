import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize view count if not exists
  await storage.initializeViewCount();

  app.get("/api/views", async (_req, res) => {
    const views = await storage.getViews();
    res.json({ views });
  });

  app.post("/api/views/increment", async (_req, res) => {
    const views = await storage.incrementViews();
    res.json({ views });
  });

  const httpServer = createServer(app);
  return httpServer;
}
