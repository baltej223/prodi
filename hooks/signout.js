export default function signout() {
  console.log("signout ran");
  // Clear session storage
  sessionStorage.clear();
  localStorage.clear();
  window.location.replace("/api/logout");

  // setTimeout(() => {
  //   window.location.replace("/login");
  // }, 100);
}