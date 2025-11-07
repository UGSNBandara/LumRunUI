import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGO_URL!; // Ensure defined via env
const dbName = process.env.DB_NAME || 'game';
const collName = process.env.COLL_NAME || 'users';

if (!uri) {
  throw new Error('Missing MONGO_URL environment variable');
}

interface Cached {
  client: MongoClient | null;
  db: Db | null;
  users: Collection | null;
}

let cached: Cached = (global as any)._mongoCached || {
  client: null,
  db: null,
  users: null,
};

if (!(global as any)._mongoCached) {
  (global as any)._mongoCached = cached;
}

export async function getUsersCollection(): Promise<Collection> {
  if (cached.users) return cached.users;
  if (!cached.client) {
    cached.client = new MongoClient(uri, {
      maxPoolSize: 5,
    });
  }
  if (!cached.db) {
    await cached.client.connect();
    cached.db = cached.client.db(dbName);
  }
  cached.users = cached.db.collection(collName);
  return cached.users;
}
