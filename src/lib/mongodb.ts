// MongoDB bağlantısı — Next.js hot-reload'da bağlantı patlamasını önlemek için
// global değişkende saklıyoruz (Prisma singleton ile aynı mantık)

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  if (!uri) {
    throw new Error(".env dosyasında MONGODB_URI tanımlı değil. Vercel Environment Variables kısmına MONGODB_URI değerinizi eklemelisiniz.");
  }
  
  const connectedClient = await clientPromise;
  return connectedClient.db();
}
