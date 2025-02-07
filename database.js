"use server";
import mongoose from "mongoose";

let UserSchema = new mongoose.Schema({
  email:String,
  password:String, 
  cookie:String
});
// as server files can only export async functions
let todoSchema =  new mongoose.Schema({ // I will have to export it as I want to make a new collection on userCreateAccount event
  email:String,
  todo:{

    lists:{
      important:[{
        todoTitle:String,
        isImportant:Boolean,
        isDone:Boolean,
       }], 
      today:[{
        todoTitle:String,
        isImportant:Boolean,
        isDone:Boolean,
      }]
    }

  }
});


export let User = mongoose.models.userData || mongoose.model("userData", UserSchema, "userLogin");


let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function connectDB() {
if (cached.connection) {
  return cached.connection;
}

if (!cached.promise) {
  const promise = mongoose.connect(process.env.MONGODB_URI);
  console.log("Connecting to ",process.env.MONGODB_URI );
  cached.promise = promise;
}

cached.connection = await cached.promise;
return cached.connection;
};

// Here I will check If collection corresponding to user email is not made, then make it

// For each user
