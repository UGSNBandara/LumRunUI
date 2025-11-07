import { NextRequest, NextResponse } from 'next/server';
// Use path alias for cleaner imports
import { getUsers, createUser } from '@/lib/users';

// Ensure this route is always dynamic and uses Node.js runtime on Vercel
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/users - list users sorted by highScore desc
export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error('GET /api/users error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function validateUsername(name: unknown): string | null {
  if (typeof name !== 'string') return 'username must be a string';
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'username is required';
  if (trimmed.length > 30) return 'username must be <= 30 characters';
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return 'username can only contain letters, numbers, _ and -';
  return null;
}

// POST /api/users - create a new user if not exists
export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    const err = validateUsername(username);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const result = await createUser(username);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('POST /api/users error', err);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
