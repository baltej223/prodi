import { redirect } from "next/navigation";

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


export function redirectTo() {
  if (document.cookie) {
    let cookies = document.cookie.split(";");
    let requiredCookie = "";
    cookies.forEach(cookie => {
      if (isJson(cookie)) {
        cookie = JSON.parse(cookie);
        if (cookie.loginCookie) {
          requiredCookie = cookie.loginCookie;
        }
      }
    });


    let currentURL = new URL(window.location.href);
    if (requiredCookie !== "") {
      if (currentURL.pathname !== "/") {
        redirect("/");
      }
    } else {
      if (currentURL.pathname !== "/login") {
        redirect("/login");
      }
    }
  }
}