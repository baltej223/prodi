"use client";
import CommandHandler from '@/hooks/commandHandler'
import signout from './signout';
import { redirectTo } from './redirectTo';

export function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  

export function RequiredCookie(){
    if (document.cookie){
  let cookies = document.cookie.split(";");
    let requiredCookie = "";
  
    cookies.forEach(cookie => {
        if (isJson(cookie)) {
            try {
                let parsedCookie = JSON.parse(cookie.trim()); // Ensure extra spaces are removed
                if (parsedCookie.loginCookie) {
                    requiredCookie = parsedCookie.loginCookie;
                }
            } catch (e) {
                // Error parsing cookie
            }
        }
    });
    return requiredCookie;
  }
  else{
    redirectTo();
    return;
  }
  }
  
  export async function getTodos() {
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.send" }),
    });
    response = await response.json();
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      signout();
      redirectTo();
      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    return response;
  }

  export async function addTodo(todoTitle, isImportant, isDone, list) {
    console.log("Adding todo:", todoTitle, isImportant, isDone, list);
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.add", data: {todoTitle, isImportant, isDone, list} }),
    });
    response = await response.json();
    console.log("response by the sever is", response);
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      alert("Error:", response.caughtError);

      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    return response;
  }


  export async function deleteTodo(_id, list) {
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.delete", data: {_id, list} }),
    });
    response = await response.json();
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      alert("Error:", response.caughtError);
      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    return response;
  }

  
  export async function markImportant(_id, list, important) {
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.important", data: {_id, list, important} }),
    });
    response = await response.json();
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    return response;
  }

  export async function isDone(_id, list, isDone) {
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.isdone", data: {_id, list, isDone} }),
    });
    response = await response.json();
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    return response;
  }


  export async function getLists() {
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.send.lists" }),
    });
    response = await response.json();
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    return response;
  }


  export async function createList(listname) {
    let response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie: RequiredCookie(), command: "todo.createlist", data:{listname}}),
    });
    response = await response.json();
    if (response.message) {
      alert(response.message);
      return;
    }
    if (response.error) {
      alert("Error:", response.error);
      return;
    }
    if (response.command) {
      CommandHandler(response.command);
    }
    alert()
    return response;
  }
