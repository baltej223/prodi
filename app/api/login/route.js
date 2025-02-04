import { NextResponse } from 'next/server';
import { connectDB, User } from '@/database.js';
import { cookies } from 'next/headers';

export async function POST(req) {

  function GenrateRandomCookie(length){
    if (!length){
      let [min,max] = [30, 70];
    length = Math.floor(((Math.random()*max)+min));
    }
    const alphanumericArray = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];
    let cookieString = "";
    for (let i=0;i<length;i++){
      let randomIndex = Math.floor(((Math.random()*alphanumericArray.length)+0));
      cookieString += alphanumericArray[randomIndex];
    } 
    return cookieString;
  }
  
  await connectDB();
  
  let loginCookie = GenrateRandomCookie();

  async function Cookie(){
    let exsitingCookieIfAny = await User.findOne({cookie:{$eq:loginCookie}});
    if (exsitingCookieIfAny == null){
      return Cookie();
    }
    else{
      return GenrateRandomCookie();
    }
  }


  const re = await req.json();
  console.log("received request:", re);
  let email = re.email.trim();
  let password = re.password.toString().trim();

  console.log("email:",email,"password:",password);
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
    
    await User.updateOne({email},{cookie:loginCookie}); // login cookie will always be diffrent as fn Cookie will return unique value only
    
    // cookiesToSave.save();
    return NextResponse.json({ cookies: {login:loginCookie}});
  } else {
    // Respond with error
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
}