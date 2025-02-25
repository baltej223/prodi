import { NextResponse } from 'next/server';
import { connectDB, User } from '@/database.js';
import mongoose from 'mongoose';
import { headers } from 'next/headers';
import { json } from 'express';

await connectDB();

export async function POST(req) {

  function NextJson(json, auxilaryObject) {
    if (auxilaryObject) {
      if (!auxilaryObject.headers) {
        auxilaryObject["headers"] = {};
        auxilaryObject.headers['Content-Type'] = 'application/json';
      }
    }
    else {
      auxilaryObject = {
        headers: {
          "Content-Type": "application/json"
        }
      };
    }
    return new NextResponse(JSON.stringify(json), auxilaryObject);
  }

  let re;
  try{
  re = await req.json();
  }catch(e){
    return new NextResponse("<code>"+e+"</code>", {
      headers: {
        "Content-Type": "application/html",
      }
      ,
      status:400
    });
  }
  let command = re.command;
  let data = re.data;
  let cookie = re.cookie;

  if (!command) {
    return NextResponse.json({ error: 'Bad Request, No command received' }, { status: 400 });
  }
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorised", command: "re-login" }, { status: 401 });
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
    udm = mongoose.models[userEmailAndModel]; // udm will be defined in every case.
    if (!udm) throw new Error('Model not found');
  } catch (e) {
    return NextResponse.json({ error: "Some internal Error occured", caughtError: e.message });
  }

  if (command == "pages.send.titles") {
    let _data = {
      // let _data = {
      //   todoTitle:"Title",
      //   isImportant:true,
      //   isDone:false,
      //   list:"listName"
      // }
    };
    let existingData = await udm.findOne({ email: userEmailAndModel }).exec();
    console.log(existingData);
    let pages_exsitingDataKeysArray = Array.from(existingData.pages.keys());
    return NextResponse.json({ message: "Successful", titles: pages_exsitingDataKeysArray });
  }
  else if (command == "pages.create") {
    let existingData = await udm.findOne({ email: userEmailAndModel }).exec();

    if (data == undefined) {
      return NextResponse.json({ error: "No data received, Nothing to work on" }, { status: "400" });
    }
    if (!(data.pageTitle)) {
      return NextResponse.json({ error: "Incomplete Parameters received" }, { status: 401 });
    }
    if (existingData.pages.has(data.pageTitle)) {
      return NextResponse.json({ error: `Page with provided page name already exists.` }, { status: 400 });
    }
    else {
      existingData.pages.set(data.pageTitle, {
        pageBody: "",
      });
      console.log(existingData.pages);
      let id = existingData.pages.get(data.pageTitle)._id;
      await udm.updateOne({ email: userEmailAndModel }, { pages: existingData.pages });
      return NextResponse.json({ message: "successful", _id: id }, { status: 200 });
    }
  }
  else if (command == "pages.delete") {
    if (!data || !data._id) {
      return NextResponse.json({ error: "Page ID not provided" }, { status: 400 });
    }

    let existingData = await udm.findOne({ email: userEmailAndModel }).exec();
    let pageFound = false;
    let pageTitle = '';

    // Find the page with matching _id
    for (let [title, page] of existingData.pages.entries()) {
      if (page._id.toString() === data._id) {
        pageTitle = title;
        pageFound = true;
        break;
      }
    }

    if (!pageFound) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Delete the page
    existingData.pages.delete(pageTitle);
    await udm.updateOne({ email: userEmailAndModel }, { pages: existingData.pages });
    return NextResponse.json({ message: "Page deleted successfully" }, { status: 200 });
  }

  else if (command == "pages.edit") {
    if (!data || !data._id || !data.pageBody) {
      return NextResponse.json({ error: "Missing required parameters: _id or pageBody" }, { status: 400 });
    }

    let existingData = await udm.findOne({ email: userEmailAndModel }).exec();
    let pageFound = false;
    let pageTitle = '';

    // Find the page with matching _id
    for (let [title, page] of existingData.pages.entries()) {
      if (page._id.toString() === data._id) {
        pageTitle = title;
        pageFound = true;
        break;
      }
    }

    if (!pageFound) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Get the page data
    let pageData = existingData.pages.get(pageTitle);
    pageData.pageBody = data.pageBody;

    // Delete old entry and add new one if title is changing
    if (data.pageTitle && data.pageTitle !== pageTitle) {
      existingData.pages.delete(pageTitle);
      existingData.pages.set(data.pageTitle, pageData);
    } else {
      existingData.pages.set(pageTitle, pageData);
    }

    try {
      await udm.updateOne({ email: userEmailAndModel }, { pages: existingData.pages });
      return NextResponse.json({ message: "Page updated successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to update page", details: error.message }, { status: 500 });
    }
  }
  
  else if (command == "pages.send.page") {
    if (!data || !data.pageTitle) {
      return NextResponse.json({ error: "Page title not provided" }, { status: 400 });
    }

    try {
      let existingData = await udm.findOne({ email: userEmailAndModel }).exec();
      
      if (!existingData) {
        return NextResponse.json({ error: "User data not found" }, { status: 404 });
      }

      // Check if pages exists
      if (!existingData.pages) {
        return NextResponse.json({ error: "Pages not initialized for this user" , user:userEmailAndModel}, { status: 404 });
      }

      // Initialize pages as Map if it's not already
      if (!(existingData.pages instanceof Map)) {
        existingData.pages = new Map(Object.entries(existingData.pages));
      }

      if (!existingData.pages.has(data.pageTitle)) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

      const pageData = existingData.pages.get(data.pageTitle);
      
      if (!pageData) {
        return NextResponse.json({ error: "Page data is empty" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Successful",
        page: {
          title: data.pageTitle,
          body: pageData.pageBody || "",
          _id: pageData._id
        }
      }, { status: 200 });

    } catch (error) {
      console.error('Error retrieving page:', error);
      return NextResponse.json({ 
        error: "Failed to retrieve page", 
        details: error.message 
      }, { status: 500 });
    }
}
}