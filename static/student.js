// ================= LOAD ALL COURSES =================
async function loadAllCourses() {
  const list = document.getElementById("allCourses");
  list.innerHTML = "<p class='text-gray-500'>Loading courses...</p>";

  const res = await fetch("/student/courses/all", {
    headers: authHeaders()
  });

  const courses = await res.json();
  list.innerHTML = "";

  if (!courses.length) {
    list.innerHTML = "<p>No courses available</p>";
    return;
  }

  courses.forEach(course => {
    const li = document.createElement("li");
    li.className =
      "border rounded-lg p-4 bg-gray-50 flex justify-between items-center";

    li.innerHTML = `
      <div>
        <h3 class="font-semibold">${course.title}</h3>
        <p class="text-gray-600 text-sm">${course.description}</p>
      </div>
      <button
        onclick="enrollCourse(${course.id})"
        class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Enroll
      </button>
    `;

    list.appendChild(li);
  });
}

// ================= ENROLL COURSE =================
async function enrollCourse(courseId) {
  const msg = document.getElementById("enrollMsg");
  msg.innerText = "Enrolling...";
  msg.className = "text-sm text-blue-600";

  const res = await fetch(`/student/courses/${courseId}/enroll`, {
    method: "POST",
    headers: authHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    msg.innerText = data.msg;
    msg.className = "text-sm text-red-600";
    return;
  }

  msg.innerText = "✅ Enrolled successfully!";
  msg.className = "text-sm text-green-600";

  loadMyCourses();
}

// ================= LOAD MY COURSES =================
async function loadMyCourses() {
  const list = document.getElementById("myCourses");
  list.innerHTML = "<p class='text-gray-500'>Loading...</p>";

  const res = await fetch("/student/courses", {
    headers: authHeaders()
  });

  const courses = await res.json();
  list.innerHTML = "";

  if (!courses.length) {
    list.innerHTML = "<p>No enrolled courses yet</p>";
    return;
  }

  courses.forEach(course => {
    const li = document.createElement("li");
    li.className = "border rounded-lg p-4 bg-gray-50";

    li.innerHTML = `
      <h3 class="font-semibold">${course.title}</h3>
      <p class="text-gray-600 text-sm">${course.description}</p>
    `;

    list.appendChild(li);
  });
}

// ================= AUTO LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  loadAllCourses();
  loadMyCourses();
});
