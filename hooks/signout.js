export default function signout() {
  const cookies = document.cookie.split(';');
  
  cookies.forEach(cookie => {
    const trimmedCookie = cookie.trim();
    if (isJson(trimmedCookie)) {
      try {
        const parsedCookie = JSON.parse(trimmedCookie);
        if (parsedCookie.loginCookie) {
          // Get the cookie name (everything before the =)
          const cookieName = trimmedCookie.split('=')[0];
          // Set an expired cookie with the same name
          document.cookie = `"{loginCookie":"${cookieName}"};expires=${new Date(0).toUTCString()};path=/`;
        }
      } catch (e) {
        console.error('Error parsing cookie:', e);
      }
    }
  });

  // Clear session storage
  sessionStorage.clear();
  localStorage.clear();

  // Redirect to login page after a short delay to ensure cookie is cleared
  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
}

function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}