import "server-only";

import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_DB_URL;

if (!MONGODB_URI) {
  throw new Error("Por favor, defina NEXT_DB_URL no ficheiro .env.local");
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: GlobalMongoose | undefined;
}

const cached = (globalThis.mongooseGlobal ??= {
  conn: null,
  promise: null,
});

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
