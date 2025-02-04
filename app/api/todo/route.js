import { NextResponse } from 'next/server';
import { connectDB, User } from '@/database.js';
// import { cookies } from 'next/headers';

await connectDB();

export async function POST(req) {

    const re = await req.json();
//   console.log("received request:", re);
    let command = re.command.trim();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Here you can handle authentication logic
  console.log('Email:', email);
  console.log('Password:', password);

  // Example: Find user in the database
  const user = await User.findOne({ email, password });

  // console.log(String(user));
  if (user) {
    // Respond with success

    if (await User.findOne({cookie:{$eq:loginCookie}}) == null){
    await User.updateOne({email},{cookie:loginCookie});
    }

    else{
      loginCookie = GenrateRandomCookie(); // if it matched with an already existing cookie?
      // Ostrich Algorithem ;)
      await User.updateOne({email},{cookie:loginCookie});
    }
    // cookiesToSave.save();
    return NextResponse.json({ cookies: {login:loginCookie}});
  } else {
    // Respond with error
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
}