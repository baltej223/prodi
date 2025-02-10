import { NextResponse } from 'next/server';
import { connectDB, User } from '@/database.js';
import mongoose from 'mongoose';
import { Drama } from 'lucide-react';

await connectDB();

export async function POST(req) {
  const re = await req.json();
  let command = re.command;
  let data = re.data;
  let cookie = re.cookie;

  if (!command) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let user;
  try {
    user = await User.findOne({ cookie }).exec();
    if (!user) {
      return NextResponse.json({ error: "unauthorized", command: "re-login" });
    }
  } catch (e) {
    return NextResponse.json({ error: "Error finding user", caughtError: e.message });
  }

  let userEmailAndModel = user.email;
  let udm; // userDataModel
  try {

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
          }
        });// this will create a fresh collection and next time when I will have to add todo or some other data then I can just fetch this model like mongoose.models[email]
    udm = mongoose.models[userEmailAndModel] || mongoose.model(user.email,dataSchema, user.email);;
    if (!udm) throw new Error('Model not found');
  } catch (e) {
    return NextResponse.json({ error: "Some internal Error occured", caughtError: e.message });
  }

  if (command == "todo.add") {
    let _data = {
      // let _data = {
      //   todoTitle:"Title",
      //   isImportant:true,
      //   isDone:false,
      //   list:"listName"
      // }
    };
    let exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
    if (!exisitingData.todo.lists.has(data.list)) {
      return NextResponse.json({ message: "Todo list does not exist" });
    }
   
    // Add the new todo to the list
    exisitingData.todo.lists.get(data.list).push({
      todoTitle: data.todoTitle,
      isImportant: Boolean(data.isImportant),
      isDone: Boolean(data.isDone),
    });

    try {
      await udm.updateOne({ email: userEmailAndModel }, {
        todo: exisitingData.todo
      });
    } catch (e) {
      return NextResponse.json({ error: "Error updating todo", caughtError: e.message });
    }
    let currentlyAddedTodo = exisitingData.todo.lists.get(data.list).find(todo => todo.todoTitle === data.todoTitle);
    return NextResponse.json({ message: "Todo Added", _id: currentlyAddedTodo._id });
  }

  if (command == "todo.delete") {
    let exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
    if (!exisitingData.todo.lists.has(data.list)) {
      return NextResponse.json({ message: "Bad parameters" });
    }
    let todoList = exisitingData.todo.lists.get(data.list);
    let todoIndex = todoList.findIndex(todo => todo._id.toString() === data._id);

    if (todoIndex === -1) {
      return NextResponse.json({ message: "Todo not found" });
    }

    todoList.splice(todoIndex, 1);

    try {
      await udm.updateOne({ email: userEmailAndModel }, {
        todo: exisitingData.todo
      });
    } catch (e) {
      return NextResponse.json({ error: "Error deleting todo", caughtError: e.message });
    }

    return NextResponse.json({ message: "Todo deleted successfully" });
  }

  if (command == "todo.send") {
    let exisitingData;
    try {
      exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
      if (!exisitingData) {
        return NextResponse.json({ error: "No data found" });
      }
    } catch (e) {
      return NextResponse.json({ error: "Error retrieving todos", caughtError: e.message });
    }

    return NextResponse.json({ todos: exisitingData.todo });
  }

  if (command == "todo.important") {
    let exisitingData;
    try {
      exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
      if (!exisitingData) {
        return NextResponse.json({ message: "User data not found" });
      }
    } catch (e) {
      return NextResponse.json({ error: "Error finding user data", caughtError: e.message });
    }

    let todoList = exisitingData.todo.lists.get(data.list);
    if (!todoList) {
      return NextResponse.json({ message: "Todo list not found" });
    }

    let todo = todoList.find(todo => todo._id.toString() === data._id);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" });
    }

    todo.isImportant = Boolean(data.important);

    try {
      await udm.updateOne({ email: userEmailAndModel }, {
        todo: exisitingData.todo
      });
    } catch (e) {
      return NextResponse.json({ error: "Error updating todo", caughtError: e.message });
    }

    return NextResponse.json({ message: "Todo importance updated successfully" });
  }

  if (command == "todo.isdone") {
    let exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
    let todoList = exisitingData.todo.lists.get(data.list);
    if (!todoList){
      return NextResponse.json({error:"List Not found"});
    }
    let todo = todoList.find(todo => todo._id.toString() === data._id);

    if (!todo) {
      return NextResponse.json({ message: "Todo not found" });
    }

    todo.isDone = Boolean(data.isDone);

    try {
      await udm.updateOne({ email: userEmailAndModel }, {
        todo: exisitingData.todo
      });
    } catch (e) {
      return NextResponse.json({ error: "Error updating todo", caughtError: e.message });
    }

    return NextResponse.json({ message: "Todo status updated successfully" });
  }

  if (command == "todo.createlist") {
    let exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
    
    if (!data.list) {
      return NextResponse.json({ error: "List name is required" });
    }

    if (exisitingData.todo.lists.has(data.list)) {
      return NextResponse.json({ message: "Todo list already exists" });
    }

    exisitingData.todo.lists.set(data.list, []);

    try {
      await udm.updateOne({ email: userEmailAndModel }, {
        todo: exisitingData.todo
      });
    } catch (e) {
      return NextResponse.json({ error: "Error updating todo", caughtError: e.message });
    }

    return NextResponse.json({ message: "List created Successfully" });
  }

  if (command == "todo.send.lists") {
    let exisitingData = await udm.findOne({ email: userEmailAndModel }).exec();
    
    if (!exisitingData || !exisitingData.todo || !exisitingData.todo.lists) {
        return NextResponse.json({ error: "No lists found" });
    }

    // Get all keys from the Map
    const listNames = Array.from(exisitingData.todo.lists.keys());

    return NextResponse.json({ lists: listNames });
}
}