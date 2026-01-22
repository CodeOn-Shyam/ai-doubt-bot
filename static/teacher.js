// ================= CREATE COURSE =================
async function createCourse() {
  const title = document.getElementById("courseTitle").value;
  const description = document.getElementById("courseDescription").value;
  const msg = document.getElementById("courseMsg");

  if (!title || !description) {
    msg.innerText = "Title and description are required";
    return;
  }

  const res = await fetch("/teacher/courses", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, description })
  });

  const data = await res.json();

  msg.innerText = data.msg || "Error creating course";

  if (res.ok) {
    document.getElementById("courseTitle").value = "";
    document.getElementById("courseDescription").value = "";
    loadMyCourses(); // refresh list
  }
}

// ================= LOAD MY COURSES =================
async function loadMyCourses() {
  const list = document.getElementById("courseList");
  list.innerHTML = "<p class='text-gray-500'>Loading...</p>";

  const res = await fetch("/teacher/courses", {
    headers: authHeaders()
  });

  const courses = await res.json();
  list.innerHTML = "";

  if (!courses.length) {
    list.innerHTML =
      "<p class='text-gray-500'>No courses created yet</p>";
    return;
  }

  courses.forEach(course => {
    const li = document.createElement("li");
    li.className =
      "border rounded-lg p-4 bg-gray-50 hover:shadow transition";

    li.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-800">
        ${course.title}
      </h3>
      <p class="text-gray-600">${course.description}</p>
      <span class="text-sm text-gray-400">
        Course ID: ${course.id}
      </span>
    `;

    list.appendChild(li);
  });
}

// ================= UPLOAD DOCUMENT =================
async function uploadDocument() {
  const courseId = document.getElementById("uploadCourseId").value;
  const fileInput = document.getElementById("docFile");
  const msg = document.getElementById("docMsg");

  // Reset message
  msg.innerText = "";
  msg.className = "text-sm mt-2";

  if (!courseId || fileInput.files.length === 0) {
    msg.innerText = "Course ID and file are required";
    msg.classList.add("text-red-600");
    return;
  }

  // Loading state
  msg.innerText = "Uploading document...";
  msg.classList.add("text-blue-600");

  const formData = new FormData();
  formData.append("course_id", courseId);
  formData.append("file", fileInput.files[0]);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/documents/upload", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.msg || "Upload failed";
      msg.className = "text-sm mt-2 text-red-600";
      return;
    }

    // Success state
    msg.innerText = "✅ Document uploaded successfully!";
    msg.className = "text-sm mt-2 text-green-600";

    // Reset inputs
    fileInput.value = "";
    document.getElementById("uploadCourseId").value = "";

  } catch (err) {
    msg.innerText = "❌ Network error. Try again.";
    msg.className = "text-sm mt-2 text-red-600";
  }
}
// ================= AUTO LOAD =================
document.addEventListener("DOMContentLoaded", loadMyCourses);
