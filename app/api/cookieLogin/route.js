import { NextResponse } from 'next/server';
import { connectDB, User } from '@/database.js';
// import { cookies } from 'next/headers';

await connectDB();

export async function POST(req) {

    const re = await req.json();
//   re : {"cookie":"cookie"}
    let cookie = re.cookie.trim();
    let data = re.data.trim();
  if (!command && !data) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }


  
}