async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password,
      role: role
    })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("msg").innerText = data.msg;
    return;
  }

  // SAVE TOKEN
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("role", data.role);

  // REDIRECT
  if (data.role === "teacher") {
    window.location.href = "/teacher/dashboard";
  } else {
    window.location.href = "/student/dashboard";
  }
}
function getToken() {
  return localStorage.getItem("token");
}

async function createCourse() {
  const title = document.getElementById("courseTitle").value;

  const res = await fetch("/teacher/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getToken()
    },
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

  const res = await fetch("/documents/upload", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + getToken()
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
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });

  const data = await res.json();
  document.getElementById("enrollMsg").innerText = data.msg;
}

async function loadMyCourses() {
  const res = await fetch("/student/courses", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
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
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  document.getElementById("msg").innerText = data.msg;

  if (res.ok) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }
}
