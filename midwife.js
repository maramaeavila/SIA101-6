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

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutUser);
}

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
      fetchHealthFormData();
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Prenatal Care") {
      document.getElementById("PreNatalSection").style.display = "block";
    } else if (sectionName === "Family Planning") {
      document.getElementById("FamilyPlanSection").style.display = "block";
    } else if (sectionName === "Reports") {
      document.getElementById("reportSection").style.display = "block";
    } else if (sectionName === "Change Account") {
      document.getElementById("changeAccountSection").style.display = "block";
    }
  });
});

function toggleUserMenu() {
  const userMenu = document.getElementById("userMenu");
  userMenu.style.display = userMenu.style.display === "none" ? "block" : "none";
}

function showLogoutModal() {
  const modal = document.getElementById("logoutModal");
  modal.style.display = "flex";
}

function closeLogoutModal() {
  const modal = document.getElementById("logoutModal");
  modal.style.display = "none";
}

document.getElementById("confirmLogout").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("cancelLogout").addEventListener("click", () => {
  closeLogoutModal();
});

function displayLoggedInUserProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser && loggedInUser.profileUrl) {
    const profileImage = `<img src="${loggedInUser.profileUrl}" alt="Profile Image" style="width: 40px; height: 40px; border-radius: 50%;margin-top:10px">`;
    document.getElementById("profileImageContainer").innerHTML = profileImage;
  } else {
    const defaultIcon = `<i class="fa-solid fa-user" style="font-size: 80px; color: white; margin: 15%;"></i>`;
    document.getElementById("profileImageContainer").innerHTML = defaultIcon;
  }
}

window.onload = displayLoggedInUserProfile;

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
    const formattedDate = `${String(month + 1).padStart(2, "0")}/${String(
      day
    ).padStart(2, "0")}/${year}`;
    dayElement.innerText = day;
    dayElement.dataset.date = formattedDate;

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

  db.ref("6-Health-Appointments")
    .orderByChild("appointmentDate")
    .equalTo(date)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const appointment = childSnapshot.val();
          const listItem = document.createElement("li");
          listItem.classList.add("appointment-item");
          listItem.innerText = `${appointment.appointmentTime} - ${appointment.healthService} with ${appointment.healthcareProvider} (${appointment.status}) - ${appointment.healthService}`;
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

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("appointmentDatePicker").value = formattedDate;

  fetchAppointmentsByDate();
});

document
  .getElementById("appointmentDatePicker")
  .addEventListener("change", fetchAppointmentsByDate);

function fetchAppointmentsByDate() {
  let selectedDate = document.getElementById("appointmentDatePicker").value;

  if (!selectedDate) {
    swal({
      title: "Warning",
      text: "Please select a date.",
      icon: "warning",
      button: "OK",
    });
    return;
  }

  const [year, month, day] = selectedDate.split("-");
  selectedDate = `${month}/${day}/${year}`;

  const appointmentsRef = db.ref("6-Health-Appointments");

  appointmentsRef
    .once("value")
    .then((snapshot) => {
      const appointments = [];

      snapshot.forEach((childSnapshot) => {
        const appointment = childSnapshot.val();
        if (appointment.appointmentDate === selectedDate) {
          appointments.push(appointment);
        }
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

function fetchPrenatal() {
  const patientId = document.getElementById("patientIdInput").value;

  if (patientId.trim() === "") {
    swal({
      title: "Warning",
      text: "Please enter a valid Resident ID.",
      icon: "warning",
      button: "OK",
    });
    return;
  }

  db.ref(`Residents/${patientId}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const resident = snapshot.val();

        const firstName = resident.firstName || "";
        const middleName = resident.middleName || "";
        const lastName = resident.lastName || "";

        const fullName = `${firstName} ${
          middleName ? middleName + " " : ""
        }${lastName}`;

        document.getElementById("patientId").textContent = patientId;
        document.getElementById("patientName").textContent = fullName;
        document.getElementById("patientAge").textContent =
          resident.age || "N/A";
        document.getElementById("patientSex").textContent =
          resident.sex || "N/A";
        document.getElementById("patientAddress").textContent =
          resident.address || "N/A";

        const patientDataSection =
          document.getElementById("patientDataSection");
        if (patientDataSection) {
          patientDataSection.style.display = "block";
        } else {
          console.error("Element with ID 'patientDataSection' not found.");
        }
      } else {
        swal({
          title: "Warning",
          text: "Resident ID not found.",
          icon: "warning",
          button: "OK",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
      swal({
        title: "Warning",
        text: "An error occurred while loading resident data.",
        icon: "warning",
        button: "OK",
      });
    });
}

function fetchFamilyplan() {
  const patientId = document.getElementById("patientIdInputFamilyPlan").value;

  if (patientId.trim() === "") {
    swal({
      title: "Warning",
      text: "Please enter a valid Resident ID.",
      icon: "warning",
      button: "OK",
    });
    return;
  }

  db.ref(`Residents/${patientId}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const resident = snapshot.val();

        const firstName = resident.firstName || "";
        const middleName = resident.middleName || "";
        const lastName = resident.lastName || "";

        const fullName = `${firstName} ${
          middleName ? middleName + " " : ""
        }${lastName}`;

        document.getElementById("patientIdFamilyPlan").textContent = patientId;
        document.getElementById("patientNameFamilyPlan").textContent = fullName;
        document.getElementById("patientAgeFamilyPlan").textContent =
          resident.age || "N/A";
        document.getElementById("patientSexFamilyPlan").textContent =
          resident.sex || "N/A";
        document.getElementById("patientAddressFamilyPlan").textContent =
          resident.address || "N/A";

        const patientDataSection = document.getElementById(
          "patientDataFamilyPlan"
        );
        if (patientDataSection) {
          patientDataSection.style.display = "block";
        } else {
          console.error("Element with ID 'patientDataFamilyPlan' not found.");
        }
      } else {
        swal({
          title: "Warning",
          text: "Resident ID not found.",
          icon: "warning",
          button: "OK",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
      swal({
        title: "Warning",
        text: "An error occurred while loading resident data.",
        icon: "warning",
        button: "OK",
      });
    });
}

function fetchHealthFormData() {
  const formDataTableBody = document.querySelector("#patientSection tbody");

  formDataTableBody.innerHTML = "";

  db.ref("6-FamilyPlan")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();

          const row = `
            <tr>
              <td>${data.patientId || "N/A"}</td>
              <td>${data.formId || "N/A"}</td>
              <td>${new Date(data.timestamp).toLocaleString() || "N/A"}</td>
              <td>${data.diabetes || "N/A"}</td>
              <td>${data.heartDisease || "N/A"}</td>
              <td>${data.hypertension || "N/A"}</td>
              <td>${data.gravida || "N/A"}</td>
              <td>${data.para || "N/A"}</td>
              <td>${data.numChildren || "N/A"}</td>
              <td>${data.lmp || "N/A"}</td>
              <td>${data.menstrualCycle || "N/A"}</td>
              <td>${data.preferredMethods || "N/A"}</td>
              <td>${data.counselingProvided || "N/A"}</td>
              <td>${data.otherMedical || "N/A"}</td>
              <td>${data.weight || "N/A"}</td>
            </tr>
          `;

          formDataTableBody.insertAdjacentHTML("beforeend", row);
        });
      } else {
        formDataTableBody.innerHTML =
          "<tr><td colspan='15'>No data available</td></tr>";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      formDataTableBody.innerHTML =
        "<tr><td colspan='15'>Error fetching data</td></tr>";
    });
}

// function fetchHealthFormData() {
//   const formDataTableBody = document.querySelector("#patientSection tbody");

//   formDataTableBody.innerHTML = "";

//   db.ref("6-Health-FormData")
//     .once("value")
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         snapshot.forEach((childSnapshot) => {
//           const data = childSnapshot.val();

//           const row = `
//             <tr>
//               <td>${data.patientId || "N/A"}</td>
//               <td>${data.formId || "N/A"}</td>
//               <td>${data.allergies || "N/A"}</td>
//               <td>${data.appointmentType || "N/A"}</td>
//               <td>${data.bloodPressure || "N/A"}</td>
//               <td>${data.bloodPressureStatus || "N/A"}</td>
//               <td>${data.bmi || "N/A"}</td>
//               <td>${data.bmiStatus || "N/A"}</td>
//               <td>${data.boosterDose || "N/A"}</td>
//               <td>${data.boosterDate || "N/A"}</td>
//               <td>${data.chiefComplaint || "N/A"}</td>
//               <td>${data.familyHistory || "N/A"}</td>
//               <td>${data.height || "N/A"}</td>
//               <td>${data.weight || "N/A"}</td>
//               <td>${data.medications || "N/A"}</td>
//               <td>${data.pastMedicalHistory || "N/A"}</td>
//               <td>${data.pulseRate || "N/A"}</td>
//               <td>${data.pulseRateStatus || "N/A"}</td>
//               <td>${data.respiratoryRate || "N/A"}</td>
//               <td>${data.respiratoryRateStatus || "N/A"}</td>
//               <td>${data.specialty || "N/A"}</td>
//               <td>${data.temperature || "N/A"}</td>
//               <td>${data.temperatureStatus || "N/A"}</td>
//               <td>${data.vaccinated || "N/A"}</td>
//               <td>${data.vaccineType || "N/A"}</td>
//               <td>${new Date(data.timestamp).toLocaleString() || "N/A"}</td>
//             </tr>
//           `;

//           formDataTableBody.insertAdjacentHTML("beforeend", row);
//         });
//       } else {
//         formDataTableBody.innerHTML =
//           "<tr><td colspan='26'>No data available</td></tr>";
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//       formDataTableBody.innerHTML =
//         "<tr><td colspan='26'>Error fetching data</td></tr>";
//     });
// }

document.querySelector(".nav-item a").addEventListener("click", function () {
  const sectionName = this.textContent.trim();
  if (sectionName === "Health Form Data") {
    fetchHealthFormData();
  }
});
