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

function displayLoggedInUserProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser && loggedInUser.profileUrl) {
    const profileImage = `<img src="${loggedInUser.profileUrl}" alt="Profile Image" style="width: 120px; height: 120px; border-radius: 50%;margin:20px;">`;
    document.getElementById("profileImageContainer").innerHTML = profileImage;
  } else {
    const defaultIcon = `<i class="fa-solid fa-user" style="font-size: 80px; color: white; margin: 15%;"></i>`;
    document.getElementById("profileImageContainer").innerHTML = defaultIcon;
  }
}

window.onload = displayLoggedInUserProfile;

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
      // } else if (sectionName === "Patient") {
      //   document.getElementById("patientSection").style.display = "block";
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Consultation") {
      document.getElementById("ConsultationSection").style.display = "block";
      fetchPrecheckupFormDetails(formID);
    } else if (sectionName === "Babies Vaccination") {
      document.getElementById("VaccineSection").style.display = "block";
    } else if (sectionName === "Reports") {
      document.getElementById("reportSection").style.display = "block";
    }
  });
});

// function fetchAppointmentsByDate() {
//   const selectedDate = document.getElementById("appointmentDatepicker").value;

//   if (!selectedDate) {
//     console.log("No date selected");
//     return;
//   }

//   const formattedDate = formatDateToDateObject(selectedDate);

//   const appointmentsRef = db.ref("6-Health-Appointments");

//   appointmentsRef
//     .orderByChild("appointmentDate")
//     .equalTo(formattedDate)
//     .once("value")
//     .then((snapshot) => {
//       const patientList = document.getElementById("patientList");
//       patientList.innerHTML = "";

//       if (!snapshot.exists()) {
//         console.log("No appointments found for the selected date");
//         patientList.innerHTML =
//           "<tr><td colspan='7'>No appointments found for the selected date.</td></tr>";
//         return;
//       }

//       snapshot.forEach((childSnapshot) => {
//         const data = childSnapshot.val();

//         const row = document.createElement("tr");
//         row.innerHTML = `
//           <td>${data.residentId}</td>
//           <td>${data.appointmentDate}</td>
//           <td>${data.appointmentTime}</td>
//           <td>${data.healthService}</td>
//           <td>${data.healthcareProvider}</td>
//           <td>${data.remarks}</td>
//           <td>${data.status}</td>
//         `;
//         patientList.appendChild(row);
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching appointments: ", error);
//     });
// }

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
    alert("Please select a date.");
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

function fetchPrecheckupForms() {
  const residentID = document.getElementById("residentIdInput").value.trim();

  if (!residentID) {
    alert("Please enter a valid Resident ID.");
    return;
  }

  const formsRef = db.ref("6-Health-FormData"); // Firebase reference to the database.

  formsRef
    .orderByChild("residentID")
    .equalTo(residentID)
    .once("value")
    .then((snapshot) => {
      const tableBody = document.getElementById("precheckupListData");
      tableBody.innerHTML = ""; // Clear the table content before rendering new rows.

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const formID = childSnapshot.key;

          // Dynamically create a row for each formID
          const row = document.createElement("tr");
          row.innerHTML = `<td><a href="#" onclick="fetchPrecheckupFormDetails('${formID}')">${formID}</a></td>`;
          tableBody.appendChild(row);
        });
      } else {
        alert("No forms found for this Resident ID.");
      }
    })
    .catch((error) => {
      console.error("Error fetching forms:", error);
      alert("Failed to fetch forms. Please try again.");
    });
}

function fetchPrecheckupFormDetails(formID) {
  if (!formID) {
    alert("Form ID is missing. Cannot fetch details.");
    return;
  }

  const formRef = db.ref("6-Health-FormData/" + formID); // Reference to the specific form data.

  formRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const formData = snapshot.val();

        // Populate form fields with data
        document.getElementById("height").value = formData.height || "N/A";
        document.getElementById("weight").value = formData.weight || "N/A";
        document.getElementById("bloodPressure").value =
          formData.bloodPressure || "N/A";
        document.getElementById("bloodPressureStatus").value =
          formData.bloodPressureStatus || "N/A";
        document.getElementById("temperature").value =
          formData.temperature || "N/A";
        document.getElementById("temperatureStatus").value =
          formData.temperatureStatus || "N/A";
        document.getElementById("pulseRate").value =
          formData.pulseRate || "N/A";
        document.getElementById("pulseRateStatus").value =
          formData.pulseRateStatus || "N/A";
        document.getElementById("respiratoryRate").value =
          formData.respiratoryRate || "N/A";
        document.getElementById("allergies").value =
          formData.allergies || "N/A";
        document.getElementById("currentMedications").value =
          formData.currentMedications || "N/A";
        document.getElementById("pastMedicalHistory").value =
          formData.pastMedicalHistory || "N/A";
        document.getElementById("familyHistory").value =
          formData.familyHistory || "N/A";
        document.getElementById("covidVaccinated").value =
          formData.covidVaccinated ? "Yes" : "No";
        document.getElementById("vaccineType").value =
          formData.vaccineType || "N/A";
        document.getElementById("boosterDose").value = formData.boosterDose
          ? "Yes"
          : "No";
        document.getElementById("boosterDate").value =
          formData.boosterDate || "N/A";
        document.getElementById("BMI").value = formData.BMI || "N/A";
        document.getElementById("BMIStatus").value =
          formData.BMIStatus || "N/A";

        // Show the details section
        document.getElementById("precheckupDetailsSection").style.display =
          "block";

        // Smoothly scroll to the details section
        document
          .getElementById("precheckupDetailsSection")
          .scrollIntoView({ behavior: "smooth" });
      } else {
        alert("No details found for this Form ID.");
      }
    })
    .catch((error) => {
      console.error("Error fetching form details:", error);
      alert("Failed to fetch form details. Please try again.");
    });
}

document.querySelectorAll(".fetch-details-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const formID = button.getAttribute("data-form-id");
    fetchPrecheckupFormDetails(formID);
  });
});

function fetchPrecheckupForms() {
  const residentID = document.getElementById("residentIdInput").value;

  if (!residentID) {
    alert("Please enter a Resident ID.");
    return;
  }

  const formsRef = db.ref("6-Health-FormData");

  formsRef
    .orderByChild("residentID")
    .equalTo(residentID)
    .once("value")
    .then((snapshot) => {
      const tableBody = document.getElementById("precheckupListData");
      tableBody.innerHTML = "";

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const formID = childSnapshot.key;

          const row = document.createElement("tr");
          row.innerHTML = `<td><a href="#" onclick="showFormDetails('${formID}')">${formID}</a></td>`;
          tableBody.appendChild(row);
        });
      } else {
        alert("No forms found for this Resident ID.");
      }
    })
    .catch((error) => {
      console.error("Error fetching forms:", error);
    });
}
