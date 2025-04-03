import { redirect } from "next/navigation";

export function redirectTo() {
    if (document.cookie) {
        let cookies = document.cookie.split(";");
        let requiredCookie = "";

        console.log(cookies);
        
        cookies.forEach(cookie => {
            let [cookieName, cookieValue] = cookie.split("=");
            if (cookieName.trim() == "login"){
                requiredCookie = cookieValue;
            }
        });

        console.log(requiredCookie);
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
