import { users, type User, type InsertUser } from "@shared/schema";
import { viewStats, type ViewStats, type InsertViewStats } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  initializeViewCount(): Promise<void>;
  getViews(): Promise<number>;
  incrementViews(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private views: number;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.views = 0;
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async initializeViewCount(): Promise<void> {
    // Views are already initialized to 0 in constructor
  }

  async getViews(): Promise<number> {
    return this.views;
  }

  async incrementViews(): Promise<number> {
    this.views += 1;
    return this.views;
  }
}

export const storage = new MemStorage();