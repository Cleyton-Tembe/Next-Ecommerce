"use server"

import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_DB_URL;

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável MONGODB_URI no seu .env.local");
}

// Estende o objeto global do Node para não dar erro de tipo com o TypeScript
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: GlobalMongoose | undefined;
}

// Se já existir uma conexão global, usamos ela. Se não, criamos o objeto.
let cached = globalThis.mongooseGlobal;

if (!cached) {
  cached = globalThis.mongooseGlobal = { conn: null, promise: null };
}

export async function connectDB() {
  // Se já estiver conectado, apenas retorna a conexão existente
  if (cached?.conn) {
    return cached.conn;
  }

  // Se não houver uma promessa de conexão ativa, cria uma nova
  if (!cached?.promise) {

    cached.promise = mongoose
      .connect(MONGODB_URI!,)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
