function publicHeaders() {
  return {
    "Content-Type": "application/json"
  };
}

function authHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    throw new Error("No token");
  }

  return {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  };
}


(function guardPages() {
  const protectedPages = [
    "/student/dashboard",
    "/teacher/dashboard",
    "/chat/page"
  ];

  if (protectedPages.includes(window.location.pathname)) {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }
})();
function renderNavbar() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  nav.innerHTML = "";

  if (!token) {
    nav.innerHTML = `
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    `;
    return;
  }

  if (role === "teacher") {
    nav.innerHTML = `
      <a href="/teacher/dashboard">Dashboard</a>
      <button onclick="logout()">Logout</button>
    `;
  }

  if (role === "student") {
    nav.innerHTML = `
      <a href="/student/dashboard">Dashboard</a>
      <a href="/chat/page">AI Chat</a>
      <button onclick="logout()">Logout</button>
    `;
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", renderNavbar);
