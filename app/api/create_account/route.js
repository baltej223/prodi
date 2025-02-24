import { NextResponse } from 'next/server';
import { connectDB, User } from '@/database.js'; // I had to import todo Scheam as I have to make collection for every user Who creates account
// import { unauthorized } from 'next/navigation';
// import { cookies } from 'next/headers';

import mongoose from 'mongoose';

await connectDB();

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
      
      // let loginCookie = GenrateRandomCookie();
    
      async function Cookie(){
        let exsitingCookieIfAny = await User.findOne({cookie:{$eq:GenrateRandomCookie()}});
        if (exsitingCookieIfAny != null){
          return Cookie();
        }
        else{
          return GenrateRandomCookie();
        }
      }
    

    const re = await req.json();
    console.log('Request body:', re);
    
    let email = re.email;
    let password = re.password;
    console.log('Email:', email);
    console.log('Password:', password);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    
    let existingUsers = await User.findOne({ email });
    
    if (existingUsers != null) {
      return NextResponse.json({ message: "Account Already Exists, You may login" });
    }
    
    let cookieToSave = await Cookie();
    // console.log('Generated cookie:', cookieToSave);
    
    let user = new User({ email, password, cookie: cookieToSave });
    // Here create an collection named after user email
    let dataSchema = new mongoose.Schema({ // I will have to export it as I want to make a new collection on userCreateAccount event
      email: String,
      todo: {
        lists: {
          type: Map,
          of: [
            {
              todoTitle: String,
              isImportant: Boolean,
              isDone: Boolean,
            }
          ]
        }
      },
      pages: {
        type: Map,
        of: {
          pageBody: String
        }
      }
    });

    let dataModel = mongoose.model(email,dataSchema, email);// this will create a fresh collection and next time when I will have to add todo or some other data then I can just fetch this model like mongoose.models[email]

    let data = new dataModel({
      email:email,
      todo:{
        lists:{
          important:[
            {
              todoTitle:"",
              isImportant:false,
              isDone:false,

            }
          ],
          today:[
            {
              todoTitle:"",
              isImportant:false,
              isDone:false,

            }
          ]
        }
      }, 
      pages:{
        pageTitle:{
          pageBody:"page body"
        }
      }
    });

    data.save();
    //------

    user.save().then(() => {
      console.log('User saved successfully');
      // return NextResponse.json({ cookie: { loginCookie: cookieToSave } }); // we cant return here as return value will return from .then
    }).catch((error) => {
      console.log('Error saving user:', error);
    });
    let isAccountCreated = User.findOne({email});
    if (isAccountCreated){
      return NextResponse.json({ cookie: { loginCookie: cookieToSave } });
    }
    else{
      return NextResponse.json({ error: "Some Error Occurred, Account not Created" }, { status: 500 });
    }
}