export default function signout(){
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
            document.cookie = document.cookie.replace(requiredCookie, "");
        }
        else{
            //already signed out
        }
}