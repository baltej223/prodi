"use client";
import React, { useEffect, useRef } from "react";
import Link from 'next/link'

import { redirectTo } from "@/hooks/redirectTo";


// // Hydration errors in Next.js typically occur when there is a mismatch
//  between the server-rendered HTML and the client-rendered HTML.

// Common causes and solutions for hydration errors:
// Conditional Rendering: Ensure that any conditional rendering logic is consistent between the server and client. For example, if you are checking for cookies or local storage, make sure this check is done only on the client side.
// Client-Side Only Code: Ensure that any code that should only run on the client side is wrapped in a useEffect hook.
// Unique Keys for Lists: Ensure that any lists rendered with .map() have unique keys.

// This function redirectTo checks for any stored login cookies, and redirects to ./ if have any 

//it should work onLoad to check if user is already logged if

function Signup() {
  let emailRef = useRef("");
  let passwordRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = emailRef.current.value;
    let password = passwordRef.current.value;
    const response = await fetch('/api/create_account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    });
    let res_json = await response.json();
    console.log(res_json);
    if (!res_json.error) {
      if (res_json.cookie && res_json.cookie.loginCookie) {
        document.cookie = JSON.stringify(res_json.cookie);
        alert("Signup successful!");
        // redirectTo();
      }
      else if (res_json.message){
        alert(res_json.message);
      }
    } else if (res_json.error){
      alert(res_json.error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-0 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    ref={emailRef}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    ref={passwordRef}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleSubmit}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Signup />
    </>
  );
}