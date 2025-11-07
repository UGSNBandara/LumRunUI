import { getUsersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { User } from '@/types/user';

export async function getUsers(): Promise<User[]> {
  const users = await (await getUsersCollection())
    .find({}, { projection: { username: 1, highScore: 1, createdAt: 1, updatedAt: 1 } })
    .sort({ highScore: -1, createdAt: 1 })
    .limit(100)
    .toArray();

  return users.map((u: any) => ({
    _id: (u._id as ObjectId).toString(),
    username: u.username,
    highScore: u.highScore ?? 0,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
    updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : u.updatedAt,
  }));
}

export async function createUser(username: string): Promise<User | { error: string }> {
  const col = await getUsersCollection();
  const now = new Date();

  // Check if username exists
  const existing = await col.findOne({ username });
  if (existing) {
    return { error: 'username already exists' };
  }

  const doc = {
    username,
    highScore: 0,
    createdAt: now,
    updatedAt: now,
  };
  const result = await col.insertOne(doc);

  return {
    _id: result.insertedId.toString(),
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}