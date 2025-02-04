"use server";
import mongoose from "mongoose";

let UserSchema = new mongoose.Schema({
  email:String,
  password:String, 
  cookie:String
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
