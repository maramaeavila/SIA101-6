// Firebase configuration object
var firebaseConfig = {
  apiKey: "AIzaSyDiOsr6bY5BDKdiBPRzDgSpurHdkkUlc3k",
  authDomain: "sia101-d60a1.firebaseapp.com",
  databaseURL: "https://sia101-d60a1-default-rtdb.firebaseio.com/",
  projectId: "sia101-d60a1",
  storageBucket: "sia101-d60a1.appspot.com",
  messagingSenderId: "258109532727",
  appId: "1:258109532727:web:73d735dc749d2cb4ebedb2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
var db = firebase.database();

function logoutUser() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "index.html";
      swal("Logged Out", "You have successfully logged out.", "success");
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      swal("Error", "Could not log out. Please try again.", "error");
    });
}

document.getElementById("logoutBtn").addEventListener("click", logoutUser);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dashboardSection").style.display = "block";
});

document.querySelectorAll(".nav-item a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelectorAll(".content-section").forEach((section) => {
      section.style.display = "none";
    });

    const sectionName = link.textContent.trim();

    if (sectionName === "Dashboard") {
      document.getElementById("dashboardSection").style.display = "block";
    } else if (sectionName === "Patient") {
      document.getElementById("patientSection").style.display = "block";
      fetchPatients();
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Consultation") {
      document.getElementById("ConsultationSection").style.display = "block";
    } else if (sectionName === "Babies Vaccination") {
      document.getElementById("VaccineSection").style.display = "block";
    } else if (sectionName === "Reports") {
      document.getElementById("reportSection").style.display = "block";
    } else if (sectionName === "Change Account") {
      document.getElementById("changeAccountSection").style.display = "block";
    }
  });
});

function fetchPatients() {
  const patientListBody = document.getElementById("patientList");
  patientListBody.innerHTML = "";

  db.ref("5-Health-PatientID")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const patient = childSnapshot.val();

          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${childSnapshot.key}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.sex}</td>
            <td>${patient.address}</td>
            <td>${patient.mobileNumber}</td>
            <td>${patient.civilStatus}</td>
            <td>${patient.birthdate}</td>
            <td>${patient.status}</td>
          `;

          patientListBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='9'>No patients found.</td>";
        patientListBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan='9'>Error loading patient data.</td>";
      patientListBody.appendChild(row);
    });
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let selectedDate = new Date();

function populateYearDropdown() {
  const yearSelect = document.getElementById("yearSelect");
  const startYear = 2000;
  const endYear = 2030;
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
  yearSelect.value = selectedDate.getFullYear();
}

function updateMonthYearDisplay() {
  document.getElementById("currentMonth").textContent = `${
    monthNames[selectedDate.getMonth()]
  } ${selectedDate.getFullYear()}`;
}

function generateCalendarDays() {
  const calendarDaysContainer = document.getElementById("calendarDays");
  calendarDaysContainer.innerHTML = "";

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day");
    dayElement.innerText = day;
    dayElement.dataset.date = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    dayElement.addEventListener("click", () => {
      document
        .querySelectorAll(".calendar-day")
        .forEach((day) => day.classList.remove("selected"));
      dayElement.classList.add("selected");
      displayAppointments(dayElement.dataset.date);
    });

    calendarDaysContainer.appendChild(dayElement);
  }
}

function displayAppointments(date) {
  const appointmentList = document.getElementById("appointmentList");
  appointmentList.innerHTML = "";

  db.ref("5-Health-Appointments")
    .orderByChild("appointmentDate")
    .equalTo(date)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const appointment = childSnapshot.val();
          const listItem = document.createElement("li");
          listItem.classList.add("appointment-item");
          listItem.innerText = `${appointment.appointmentTime} - ${appointment.healthService} with ${appointment.healthcareProvider} (${appointment.status}) - ${appointment.remarks}`;
          appointmentList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement("li");
        listItem.classList.add("appointment-item");
        listItem.innerText = "No appointments scheduled for this date.";
        appointmentList.appendChild(listItem);
      }
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
      const listItem = document.createElement("li");
      listItem.classList.add("appointment-item");
      listItem.innerText = "Error loading appointments.";
      appointmentList.appendChild(listItem);
    });
}

document.getElementById("prevMonth").addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  updateMonthYearDisplay();
  generateCalendarDays();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  updateMonthYearDisplay();
  generateCalendarDays();
});

document.getElementById("yearSelect").addEventListener("change", (event) => {
  selectedDate.setFullYear(parseInt(event.target.value));
  updateMonthYearDisplay();
  generateCalendarDays();
});

document.addEventListener("DOMContentLoaded", () => {
  populateYearDropdown();
  updateMonthYearDisplay();
  generateCalendarDays();
});

function fetchAppointmentsByDate() {
  const selectedDate = document.getElementById("appointmentDatePicker").value;
  if (!selectedDate) {
    alert("Please select a date.");
    return;
  }

  db.ref("5-Health-Appointments")
    .orderByChild("appointmentDate")
    .equalTo(selectedDate)
    .once("value")
    .then((snapshot) => {
      const appointments = [];
      snapshot.forEach((childSnapshot) => {
        appointments.push(childSnapshot.val());
      });

      updateAppointmentDashboard(appointments);
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
    });
}

function updateAppointmentDashboard(appointments) {
  const total = appointments.length;
  const pending = appointments.filter((app) => app.status === "PENDING").length;
  const completed = appointments.filter(
    (app) => app.status === "COMPLETED"
  ).length;
  const canceled = appointments.filter(
    (app) => app.status === "CANCELED"
  ).length;

  document.getElementById("totalAppointments").textContent = total;
  document.getElementById("pendingAppointments").textContent = pending;
  document.getElementById("completedAppointments").textContent = completed;
  document.getElementById("canceledAppointments").textContent = canceled;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("changeAccountForm");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const currentUsername = document
      .getElementById("currentUsername")
      .value.trim();
    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newUsername = document.getElementById("newUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
      swal("Error", "Please fill in all fields.", "error");
      return;
    }

    const hashedCurrentPassword = CryptoJS.MD5(currentPassword).toString();

    try {
      const snapshot = await firebase
        .database()
        .ref("6-Users")
        .orderByChild("username")
        .equalTo(currentUsername)
        .once("value");

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userKey = Object.keys(userData)[0];
        const storedHashedPassword = userData[userKey].password;

        if (hashedCurrentPassword === storedHashedPassword) {
          const hashedNewPassword = CryptoJS.MD5(newPassword).toString();

          await firebase.database().ref(`6-Users/${userKey}`).update({
            username: newUsername,
            password: hashedNewPassword,
          });

          swal(
            "Success",
            "Your account information has been updated!",
            "success"
          );
          document.getElementById("changeAccountForm").reset();
        } else {
          swal("Error", "Incorrect current password.", "error");
        }
      } else {
        swal("Error", "User not found. Please check your username.", "error");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      swal("Error", "Error updating account. Please try again.", "error");
    }
  });
});
