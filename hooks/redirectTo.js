import { redirect } from "next/navigation";

export function isJson(str) {
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
    } else {
        // fixed case when there is no CoKie
        let currentURL = new URL(window.location.href);
        if (currentURL.pathname !== "/login") {
            redirect("/login");
        }
    }
}
