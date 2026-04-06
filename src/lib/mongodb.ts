// MongoDB bağlantısı — Next.js hot-reload'da bağlantı patlamasını önlemek için
// global değişkende saklıyoruz (Prisma singleton ile aynı mantık)

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

let client: MongoClient;

export async function getDb() {
  if (!uri) {
    throw new Error(".env dosyasında MONGODB_URI tanımlı değil. Vercel Environment Variables kısmına MONGODB_URI değerinizi eklemelisiniz.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri);
      await globalWithMongo._mongoClient.connect();
    }
    client = globalWithMongo._mongoClient;
  } else {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }
  }

  return client.db(); 
}
