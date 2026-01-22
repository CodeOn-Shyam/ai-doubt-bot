async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ email, password, role })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("msg").innerText = data.msg;
    return;
  }

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("role", data.role);

  window.location.href =
    data.role === "teacher"
      ? "/teacher/dashboard"
      : "/student/dashboard";
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const endpoint =
    role === "teacher"
      ? "/auth/register/teacher"
      : "/auth/register/student";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  document.getElementById("msg").innerText = data.msg;

  if (res.ok) {
    setTimeout(() => window.location.href = "/login", 1500);
  }
}
