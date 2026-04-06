// MongoDB bağlantısı — Next.js hot-reload'da bağlantı patlamasını önlemek için
// global değişkende saklıyoruz (Prisma singleton ile aynı mantık)

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error(".env dosyasında MONGODB_URI tanımlı değil");
}

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri);
}

export async function getDb() {
  await client.connect();
  return client.db(); // URI'deki veritabanı adını kullanır (precision_inventory)
}
