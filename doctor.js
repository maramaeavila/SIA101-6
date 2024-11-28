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
    } else if (sectionName === "Patient") {
      document.getElementById("patientSection").style.display = "block";
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

function fetchAppointmentsByDate() {
  const selectedDate = document.getElementById("appointmentDatepicker").value;

  if (!selectedDate) {
    console.log("No date selected");
    return;
  }

  const formattedDate = formatDateToDateObject(selectedDate);

  const appointmentsRef = db.ref("6-Health-Appointments");

  appointmentsRef
    .orderByChild("appointmentDate")
    .equalTo(formattedDate)
    .once("value")
    .then((snapshot) => {
      const patientList = document.getElementById("patientList");
      patientList.innerHTML = "";

      if (!snapshot.exists()) {
        console.log("No appointments found for the selected date");
        patientList.innerHTML =
          "<tr><td colspan='7'>No appointments found for the selected date.</td></tr>";
        return;
      }

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.residentId}</td>
          <td>${data.appointmentDate}</td>
          <td>${data.appointmentTime}</td>
          <td>${data.healthService}</td>
          <td>${data.healthcareProvider}</td>
          <td>${data.remarks}</td>
          <td>${data.status}</td>
        `;
        patientList.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching appointments: ", error);
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

  const formRef = db.ref("6-Health-FormData/" + formID);

  formRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const formData = snapshot.val();

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

        document.getElementById("precheckupDetailsSection").style.display =
          "block";

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

// Initialize profile on page load
window.onload = function () {
  setDefaultDatePicker();
  displayLoggedInUserProfile();
  populateYearDropdown();
  updateMonthYearDisplay();
  generateCalendarDays();
  fetchHealthFormData();
};

//Patient List
let lastFetchedData = [];

function fetchHealthFormData() {
  const formDataTableBody = document.querySelector("#patientSection tbody");
  const selectedDate = document.getElementById("patientDatePicker").value;
  const searchQuery = document
    .getElementById("patientSearchBar")
    .value.toLowerCase();

  formDataTableBody.innerHTML = "";

  if (lastFetchedData.length === 0) {
    db.ref("6-Health-FormData")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          let dataArray = [];
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            dataArray.push(data);
          });

          lastFetchedData = dataArray;
          applyFilters();
        } else {
          alert("No data available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching health form data:", error);
      });
  } else {
    applyFilters();
  }

  function applyFilters() {
    const displayedPatientIds = new Set();

    const filteredData = lastFetchedData.filter((data) => {
      let recordDate = null;
      if (data.timestamp) {
        const date = new Date(data.timestamp);
        recordDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }

      const dateMatch = !selectedDate || recordDate === selectedDate;
      const specialtyMatch = data.specialty === "GeneralDoctor";
      const searchMatch =
        !searchQuery || data.patientId.toLowerCase().includes(searchQuery);

      return dateMatch && specialtyMatch && searchMatch;
    });

    filteredData.forEach((data) => {
      if (displayedPatientIds.has(data.patientId)) return;

      displayedPatientIds.add(data.patientId);

      const row = `
        <tr>
          <td>${data.patientId || "N/A"}</td>
          <td>${data.allergies || "N/A"}</td>
          <td>${data.appointmentType || "N/A"}</td>
          <td>${data.bloodPressure || "N/A"}</td>
          <td>${data.bmi || "N/A"}</td>
          <td>${data.chiefComplaint || "N/A"}</td>
          <td>${data.height || "N/A"}</td>
          <td>${data.weight || "N/A"}</td>
          <td>${data.medications || "N/A"}</td>
          <td>${data.pulseRate || "N/A"}</td>
          <td>${data.respiratoryRate || "N/A"}</td>
          <td>${data.respiratoryRateStatus || "N/A"}</td>
          <td>${data.specialty || "N/A"}</td>
          <td>${data.temperature || "N/A"}</td>
        </tr>`;
      formDataTableBody.innerHTML += row;
    });

    if (filteredData.length === 0) {
      const row = `<tr><td colspan="15">No matching records found.</td></tr>`;
      formDataTableBody.innerHTML += row;
    }
  }
}

document
  .getElementById("patientDatePicker")
  .addEventListener("change", fetchHealthFormData);
document
  .getElementById("patientSearchBar")
  .addEventListener("input", fetchHealthFormData);

//Date Setter
function setDefaultDatePicker() {
  const datePicker = document.getElementById("patientDatePicker");
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  datePicker.value = formattedDate;
}

// Modal Popup
async function getResidentData(patientId) {
  try {
    const snapshot = await db.ref(`Residents/${patientId}`).once("value");
    const residentData = snapshot.val();

    const firstName = residentData.firstName;
    const lastName = residentData.lastName;

    return {
      ...residentData,
      firstName,
      lastName,
    };
  } catch (error) {
    console.error("Error fetching resident data:", error);
    return {};
  }
}

async function showModal(patientData) {
  const modal = document.getElementById("patientModal");
  const modalContent = document.getElementById("modalContent");
  const downloadBtn = document.getElementById("downloadBtn");

  const residentData = await getResidentData(patientData.patientId);

  let content = `
    <div id="patientDetails">
      <strong>First Name:</strong> ${residentData.firstName || "N/A"}<br>
      <strong>Last Name:</strong> ${residentData.lastName || "N/A"}<br>
      <strong>Age:</strong> ${residentData.age || "N/A"}<br>
      <strong>Sex:</strong> ${residentData.sex || "N/A"}<br>
      <strong>Patient ID:</strong> ${patientData.patientId || "N/A"}<br>
      <strong>Allergies:</strong> ${patientData.allergies || "N/A"}<br>
      <strong>Appointment Type:</strong> ${
        patientData.appointmentType || "N/A"
      }<br>
      <strong>Blood Pressure:</strong> ${patientData.bloodPressure || "N/A"}<br>
      <strong>Blood Pressure Status:</strong> ${
        patientData.bloodPressureStatus || "N/A"
      }<br>
      <strong>BMI:</strong> ${patientData.bmi || "N/A"}<br>
      <strong>BMI Status:</strong> ${patientData.bmiStatus || "N/A"}<br>
      <strong>Booster Date:</strong> ${patientData.boosterDate || "N/A"}<br>
      <strong>Booster Dose:</strong> ${patientData.boosterDose || "N/A"}<br>
      <strong>Chief Complaint:</strong> ${
        patientData.chiefComplaint || "N/A"
      }<br>
      <strong>Family History:</strong> ${patientData.familyHistory || "N/A"}<br>
      <strong>Form ID:</strong> ${patientData.formId || "N/A"}<br>
      <strong>Height:</strong> ${patientData.height || "N/A"}cm<br>
      <strong>Weight:</strong> ${patientData.weight || "N/A"}kilos <br>
      <strong>Medications:</strong> ${patientData.medications || "N/A"}<br>
      <strong>Past Medical History:</strong> ${
        patientData.pastMedicalHistory || "N/A"
      }<br>
      <strong>Pulse Rate:</strong> ${patientData.pulseRate || "N/A"}<br>
      <strong>Pulse Rate Status:</strong> ${
        patientData.pulseRateStatus || "N/A"
      }<br>
      <strong>Respiratory Rate:</strong> ${
        patientData.respiratoryRate || "N/A"
      }<br>
      <strong>Respiratory Rate Status:</strong> ${
        patientData.respiratoryRateStatus || "N/A"
      }<br>
      <strong>Specialty:</strong> ${patientData.specialty || "N/A"}<br>
      <strong>Temperature:</strong> ${patientData.temperature || "N/A"}<br>
      <strong>Temperature Status:</strong> ${
        patientData.temperatureStatus || "N/A"
      }<br>
      <strong>TimeStamp:</strong> ${
        patientData.timestamp
          ? new Date(
              new Date(patientData.timestamp).setDate(
                new Date(patientData.timestamp).getDate() + 1
              )
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) +
            ", " +
            new Date(
              new Date(patientData.timestamp).setDate(
                new Date(patientData.timestamp).getDate() + 1
              )
            ).toLocaleTimeString()
          : "N/A"
      }<br>
      <strong>Vaccinated:</strong> ${patientData.vaccinated || "N/A"}<br>
      <strong>Vaccine Type:</strong> ${patientData.vaccineType || "N/A"}<br>
    </div>
  `;

  modalContent.innerHTML = content;
  modal.style.display = "block";

  downloadBtn.style.display = "inline-block";

  downloadBtn.onclick = () => {
    const plainTextContent = content
      .replace(/<br>/g, "\n")
      .replace(/<[^>]+>/g, "");
    const blob = new Blob([plainTextContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient_${patientData.patientId}_details.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

document.querySelector(".close-btn").addEventListener("click", function () {
  const modal = document.getElementById("patientModal");
  modal.style.display = "none";
  document.getElementById("downloadBtn").style.display = "none";
});

document.querySelector("tbody").addEventListener("click", function (event) {
  if (event.target && event.target.nodeName === "TD") {
    const row = event.target.closest("tr");
    const patientId = row.querySelector("td:first-child").textContent;

    const patientData = lastFetchedData.find(
      (data) => data.patientId === patientId
    );

    if (patientData) {
      showModal(patientData);
    }
  }
});
