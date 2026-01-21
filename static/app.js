// For PUBLIC APIs (login, register)
function publicHeaders() {
  return {
    "Content-Type": "application/json"
  };
}

// For PROTECTED APIs
function authHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.clear();
    window.location.href = "/login";
    return {};   // prevent JS crash
  }

  return {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  };
}


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

async function createCourse() {
  const title = document.getElementById("courseTitle").value;

  const res = await fetch("/teacher/courses", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title })
  });

  const data = await res.json();
  document.getElementById("courseMsg").innerText = data.msg || "Course created";
}

async function uploadDocument() {
  const courseId = document.getElementById("courseId").value;
  const fileInput = document.getElementById("docFile");

  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("file", fileInput.files[0]);

  const token = localStorage.getItem("token");

  const res = await fetch("/documents/upload", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token   
    },
    body: formData
  });

  const data = await res.json();
  document.getElementById("docMsg").innerText = data.msg;
}

async function enrollCourse() {
  const courseId = document.getElementById("enrollCourseId").value;

  const res = await fetch(`/student/courses/${courseId}/enroll`, {
    method: "POST",
    headers: authHeaders()
  });

  const data = await res.json();
  document.getElementById("enrollMsg").innerText = data.msg;
}

async function loadMyCourses() {
  const res = await fetch("/student/courses", {
    headers: authHeaders()
  });

  const courses = await res.json();
  const list = document.getElementById("courseList");
  list.innerHTML = "";

  courses.forEach(c => {
    const li = document.createElement("li");
    li.innerText = `${c.id} - ${c.title}`;
    list.appendChild(li);
  });
}

function goToChat() {
  window.location.href = "/chat/page";
}
// ----------------------------
// ASK AI QUESTION
// ----------------------------
async function askQuestion() {
  const question = document.getElementById("question").value;
  const answerBox = document.getElementById("answer");

  answerBox.innerText = "Thinking...";

  const res = await fetch("/chat", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  answerBox.innerText = data.answer || data.msg;
}

function goBack() {
  window.location.href = "/student/dashboard";
}
// ----------------------------
// REGISTER USER
// ----------------------------
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

