var firebaseConfig = {
  apiKey: "AIzaSyDiOsr6bY5BDKdiBPRzDgSpurHdkkUlc3k",
  authDomain: "sia101-d60a1.firebaseapp.com",
  databaseURL: "https://sia101-d60a1-default-rtdb.firebaseio.com/",
  projectId: "sia101-d60a1",
  storageBucket: "sia101-d60a1.appspot.com",
  messagingSenderId: "258109532727",
  appId: "1:258109532727:web:73d735dc749d2cb4ebedb2",
};

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
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Consultation") {
      document.getElementById("ConsultationSection").style.display = "block";
    } else if (sectionName === "Patient Records") {
      document.getElementById("dentalCheckupRecords").style.display = "block";
      fetchDentalCheckupData();
    } else if (sectionName === "Time In/Time Out") {
      document.getElementById("timeInOutSection").style.display = "block";
      fetchTimeRecords();
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

// Set the datepicker to the current date
function setDefaultDate() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
  document.getElementById("appointmentDatepicker").value = formattedDate;
}

// Fetch appointments for the selected or default date
function fetchAppointmentsByDate() {
  const selectedDate = document.getElementById("appointmentDatepicker").value;

  // Ensure a date is selected (fallback to today's date)
  if (!selectedDate) {
    console.error("No date selected, setting to today.");
    setDefaultDate(); // Reset to today's date
    return;
  }

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const appointmentsRef = db.ref("6-Health-Appointment");

  appointmentsRef
    .orderByChild("appointmentDate")
    .equalTo(formattedDate)
    .once("value")
    .then((snapshot) => {
      const patientList = document.getElementById("patientList");
      patientList.innerHTML = ""; // Clear previous list

      if (!snapshot.exists()) {
        console.log("No appointments found for the selected date");
        patientList.innerHTML =
          "<tr><td colspan='8'>No appointments found for the selected date.</td></tr>";
        return;
      }

      const appointments = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        appointments.push(data);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.residentId}</td>
          <td>${data.appointmentDate}</td>
          <td>${data.appointmentTime}</td>
          <td>${data.healthService}</td>
          <td>${data.healthcareProvider}</td>
          <td>${data.remarks}</td>
          <td>${data.status}</td>
          <td>
            <button onclick="updateAppointmentStatus('${childSnapshot.key}', 'COMPLETED')" class="btn btn-success btn-sm">Complete</button>
            <button onclick="updateAppointmentStatus('${childSnapshot.key}', 'CANCELED')" class="btn btn-danger btn-sm">Cancel</button>
          </td>
        `;
        patientList.appendChild(row);
      });

      // Update the dashboard counters
      updateAppointmentDashboard(appointments);
    })
    .catch((error) => {
      console.error("Error fetching appointments: ", error);
    });
}

// Automatically set the datepicker and fetch data for today on page load
window.onload = function () {
  setDefaultDate();
  fetchAppointmentsByDate(); // Fetch appointments for the current date
};

// Update appointment status
function updateAppointmentStatus(appointmentKey, newStatus) {
  const appointmentRef = db.ref(`6-Health-Appointment/${appointmentKey}`);

  appointmentRef
    .update({ status: newStatus })
    .then(() => {
      alert(`Appointment marked as ${newStatus}.`);
      fetchAppointmentsByDate();
    })
    .catch((error) => {
      console.error("Error updating appointment status: ", error);
    });
}

function fetchPatientData() {
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

function timeIn() {
  const username = getLoggedInUsername();
  if (!username) {
    swal("Error", "You must be logged in to clock in.", "error");
    return;
  }

  const todayDate = getCurrentDate();
  const timeRecordsRef = db.ref(`6-timeRecords/${username}/${todayDate}`);

  timeRecordsRef.once("value", (snapshot) => {
    const data = snapshot.val();
    if (data && data.timeIn) {
      swal("Error", "You have already clocked in today.", "error");
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeInData = { timeIn: formattedTime, timestamp: now.toISOString() };

    timeRecordsRef
      .set(timeInData)
      .then(() => {
        swal("Success", "Time In recorded successfully!", "success");
        fetchTimeRecords();
      })
      .catch((error) => {
        console.error("Error recording Time In:", error);
        swal("Error", "Failed to record Time In.", "error");
      });
  });
}

function timeOut() {
  const username = getLoggedInUsername();
  if (!username) {
    swal("Error", "You must be logged in to clock out.", "error");
    return;
  }

  const todayDate = getCurrentDate();
  const timeRecordsRef = db.ref(`6-timeRecords/${username}/${todayDate}`);

  timeRecordsRef.once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data || !data.timeIn) {
      swal("Error", "You must clock in first before clocking out.", "error");
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeOutData = {
      timeOut: formattedTime,
      timestamp: now.toISOString(),
    };

    timeRecordsRef
      .update(timeOutData)
      .then(() => {
        swal("Success", "Time Out recorded successfully!", "success");
        fetchTimeRecords();
      })
      .catch((error) => {
        console.error("Error recording Time Out:", error);
        swal("Error", "Failed to record Time Out.", "error");
      });
  });
}

function fetchTimeRecords() {
  const username = getLoggedInUsername();
  if (!username) {
    swal("Error", "You must be logged in to view time records.", "error");
    return;
  }

  const timeRecordsRef = db.ref(`6-timeRecords/${username}`);

  timeRecordsRef.once("value", (snapshot) => {
    const data = snapshot.val();
    const timeRecordsTable = document.getElementById("timeRecordsTable");

    if (data) {
      let tableHTML = `
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
      `;

      for (const dateKey in data) {
        const record = data[dateKey];
        const timeIn = record.timeIn;
        const timeOut = record.timeOut;

        if (timeIn && timeOut) {
          const totalHours = calculateTotalHours(timeIn, timeOut);
          tableHTML += `
            <tr>
              <td>${dateKey}</td>
              <td>${timeIn}</td>
              <td>${timeOut}</td>
              <td>${totalHours}</td>
            </tr>
          `;
        }
      }

      tableHTML += `</tbody>`;
      timeRecordsTable.innerHTML = tableHTML;
    } else {
      timeRecordsTable.innerHTML =
        "<tr><td colspan='4'>No records found.</td></tr>";
    }
  });
}

function calculateTotalHours(timeIn, timeOut) {
  const timeIn24 = convertTo24HourFormat(timeIn);
  const timeOut24 = convertTo24HourFormat(timeOut);

  const timeInDate = new Date(`1970-01-01T${timeIn24}:00`);
  const timeOutDate = new Date(`1970-01-01T${timeOut24}:00`);
  let diffInMilliseconds = timeOutDate - timeInDate;

  if (diffInMilliseconds < 0) {
    const nextDay = new Date(timeOutDate);
    nextDay.setDate(nextDay.getDate() + 1);
    diffInMilliseconds = nextDay - timeInDate;
  }

  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours.toFixed(2);
}

function convertTo24HourFormat(time) {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map((num) => parseInt(num));

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function getLoggedInUsername() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  return loggedInUser ? loggedInUser.username : null;
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toggleTextInput(radioGroupName, textInputId) {
  const radios = document.getElementsByName(radioGroupName);
  let isNoSelected = false;

  radios.forEach((radio) => {
    if (radio.checked && radio.value === "No") {
      isNoSelected = true;
    }
  });

  document.getElementById(textInputId).disabled = isNoSelected;
}

document
  .getElementById("medicationYes")
  .addEventListener("change", function () {
    toggleTextInput("medication", "medicationDetails");
  });
document.getElementById("medicationNo").addEventListener("change", function () {
  toggleTextInput("medication", "medicationDetails");
});

document.getElementById("allergyYes").addEventListener("change", function () {
  toggleTextInput("allergy", "allergyDetails");
});
document.getElementById("allergyNo").addEventListener("change", function () {
  toggleTextInput("allergy", "allergyDetails");
});

window.onload = function () {
  toggleTextInput("medication", "medicationDetails");
  toggleTextInput("allergy", "allergyDetails");
};

function validateDentalHistoryForm() {
  const reasonForVisit = document.getElementById("reasonForVisit").value;
  const treatmentDetails = document.getElementById("treatmentDetails").value;
  const preventiveCare = document.getElementById("preventiveCare").value;
  const gumsCondition = document.getElementById("gumsCondition").value;
  const oralTissues = document.getElementById("oralTissues").value;

  if (
    !reasonForVisit ||
    !treatmentDetails ||
    !preventiveCare ||
    !gumsCondition ||
    !oralTissues
  ) {
    swal({
      title: "Warning",
      text: "Please fill out all required fields.",
      icon: "warning",
      button: "OK",
    });
    return false;
  }

  return true;
}

function submitDentalHistory() {
  if (!validateDentalHistoryForm()) return;

  const patientId = document.getElementById("patientId").textContent;
  const patientName = document.getElementById("patientName").textContent;
  const reasonForVisit = document.getElementById("reasonForVisit").value;
  const treatmentDetails = document.getElementById("treatmentDetails").value;
  const preventiveCare = document.getElementById("preventiveCare").value;
  const gumsCondition = document.getElementById("gumsCondition").value;
  const oralTissues = document.getElementById("oralTissues").value;
  const followupPlan = document.getElementById("followupPlan").value || "None";

  const medicalConditions = [];
  const conditions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "heartDisease", label: "Heart Disease" },
    { id: "hypertension", label: "Hypertension" },
    { id: "asthma", label: "Asthma" },
    { id: "hiv", label: "HIV/AIDS" },
  ];

  conditions.forEach((condition) => {
    if (document.getElementById(condition.id).checked) {
      medicalConditions.push(condition.label);
    }
  });

  const otherMedicalDetails =
    document.getElementById("otherMedicalDetails").value || "None";
  if (
    document.getElementById("otherMedical").checked &&
    otherMedicalDetails !== "None"
  ) {
    medicalConditions.push(`Other: ${otherMedicalDetails}`);
  }

  const medications =
    document.querySelector('input[name="medication"]:checked')?.value || "No";
  const medicationDetails =
    medications === "Yes"
      ? document.getElementById("medicationDetails").value || "None"
      : "None";

  const allergies =
    document.querySelector('input[name="allergy"]:checked')?.value || "No";
  const allergyDetails =
    allergies === "Yes"
      ? document.getElementById("allergyDetails").value || "None"
      : "None";

  const previousTreatment =
    document.querySelector('input[name="previousTreatment"]:checked')?.value ||
    "No";
  const previousTreatmentDetails =
    previousTreatment === "Yes"
      ? document.getElementById("previousTreatmentDetails").value || "None"
      : "None";

  const symptoms = [];
  const symptomConditions = [
    { id: "toothache", label: "Toothache" },
    { id: "sensitivity", label: "Sensitivity to hot or cold" },
    { id: "bleedingGums", label: "Bleeding gums" },
    { id: "badBreath", label: "Bad breath" },
    { id: "swollenGums", label: "Swollen gums" },
    { id: "looseTeeth", label: "Loose teeth" },
  ];

  symptomConditions.forEach((symptom) => {
    if (document.getElementById(symptom.id).checked) {
      symptoms.push(symptom.label);
    }
  });

  const otherSymptomsDetails =
    document.getElementById("otherSymptomsDetails").value || "None";
  if (
    document.getElementById("otherSymptoms").checked &&
    otherSymptomsDetails !== "None"
  ) {
    symptoms.push(`Other: ${otherSymptomsDetails}`);
  }

  const brushingFrequency =
    document.querySelector('input[name="brushFrequency"]:checked')?.value ||
    "Not specified";
  const flossing =
    document.querySelector('input[name="floss"]:checked')?.value ||
    "Not specified";
  const mouthwash =
    document.querySelector('input[name="mouthwash"]:checked')?.value ||
    "Not specified";

  const formId = `${patientId}-${Math.floor(100000 + Math.random() * 900000)}`;

  const dentalHistoryData = {
    patientId,
    patientName,
    reasonForVisit,
    treatmentDetails,
    preventiveCare,
    gumsCondition,
    oralTissues,
    medicalConditions,
    medications,
    medicationDetails,
    allergies,
    allergyDetails,
    previousTreatment,
    previousTreatmentDetails,
    symptoms,
    followupPlan,
    brushingFrequency,
    flossing,
    mouthwash,
    formId,
    timestamp: new Date().toISOString(),
  };

  firebase
    .database()
    .ref(`6-DentalCheckup/${formId}`)
    .set(dentalHistoryData)
    .then(() => {
      swal(
        "Success",
        `Dental history submitted successfully! Form ID: ${formId}`,
        "success"
      );
      clearDentalHistoryForm();
    })
    .catch((error) => {
      console.error("Error submitting dental history:", error);
      swal("Error", "Failed to submit the form. Please try again.", "error");
    });
}

function clearDentalHistoryForm() {
  document.getElementById("reasonForVisit").value = "";
  document.getElementById("treatmentDetails").value = "";
  document.getElementById("preventiveCare").value = "";
  document.getElementById("gumsCondition").value = "";
  document.getElementById("oralTissues").value = "";
  document.getElementById("followupPlan").value = "";
  document
    .querySelectorAll("input[type=checkbox]")
    .forEach((checkbox) => (checkbox.checked = false));
  document
    .querySelectorAll("input[type=radio]")
    .forEach((radio) => (radio.checked = false));
  document.getElementById("otherMedicalDetails").value = "";
  document.getElementById("otherSymptomsDetails").value = "";
  document.getElementById("medicationDetails").value = "";
  document.getElementById("allergyDetails").value = "";
  document.getElementById("previousTreatmentDetails").value = "";
}

let allDentalCheckups = [];
let filteredDentalCheckups = [];
let currentPage = 1;
const rowsPerPage = 10;

function fetchDentalCheckupData() {
  const dentalCheckupListBody = document.getElementById(
    "dentalCheckupListData"
  );
  dentalCheckupListBody.innerHTML = "";

  db.ref("6-DentalCheckup")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        allDentalCheckups = [];
        snapshot.forEach((childSnapshot) => {
          const dentalCheckup = childSnapshot.val();
          const dentalCheckupData = {
            formId: childSnapshot.key,
            patientName: dentalCheckup.patientName,
            treatmentDetails: dentalCheckup.treatmentDetails,
          };
          allDentalCheckups.push(dentalCheckupData);
        });

        filteredDentalCheckups = [...allDentalCheckups];
        displayDentalCheckups();
      } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="8">No dental checkup records found.</td>`;
        dentalCheckupListBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching dental checkup data:", error);
    });
}

function displayDentalCheckups() {
  const dentalCheckupListBody = document.getElementById(
    "dentalCheckupListData"
  );
  dentalCheckupListBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedDentalCheckups = filteredDentalCheckups.slice(start, end);

  if (paginatedDentalCheckups.length > 0) {
    paginatedDentalCheckups.forEach((checkup) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${checkup.formId}</td>
        <td>${checkup.patientName}</td>
        <td>${checkup.treatmentDetails}</td>
      `;

      row.addEventListener("click", () => openDentalCheckupModal(checkup));

      dentalCheckupListBody.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3">No dental checkups found for this page.</td>`;
    dentalCheckupListBody.appendChild(row);
  }

  updatePagination();
}

function openDentalCheckupModal(checkup) {
  const modal = document.getElementById("dentalCheckupModal");
  const modalContent = document.getElementById("modalContent");

  const formId = checkup.formId;

  firebase
    .database()
    .ref(`6-DentalCheckup/${formId}`)
    .once("value")
    .then((snapshot) => {
      const dentalCheckupDetails = snapshot.val();

      if (dentalCheckupDetails) {
        const medicalConditions = Array.isArray(
          dentalCheckupDetails.medicalConditions
        )
          ? dentalCheckupDetails.medicalConditions
          : [dentalCheckupDetails.medicalConditions || "None"];

        const symptoms = Array.isArray(dentalCheckupDetails.symptoms)
          ? dentalCheckupDetails.symptoms
          : [dentalCheckupDetails.symptoms || "None"];

        modalContent.innerHTML = `
          <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <div style="flex: 1; min-width: 250px;">
              <p><strong>Form ID:</strong> ${dentalCheckupDetails.formId}</p>
              <p><strong>Patient ID:</strong> ${
                dentalCheckupDetails.patientId
              }</p>
              <p><strong>Patient Name:</strong> ${
                dentalCheckupDetails.patientName
              }</p>
              <p><strong>Reason for Visit:</strong> ${
                dentalCheckupDetails.reasonForVisit
              }</p>
              <p><strong>Treatment Details:</strong> ${
                dentalCheckupDetails.treatmentDetails
              }</p>
              <p><strong>Preventive Care:</strong> ${
                dentalCheckupDetails.preventiveCare
              }</p>
              <p><strong>Gums Condition:</strong> ${
                dentalCheckupDetails.gumsCondition
              }</p>
              <p><strong>Oral Tissues:</strong> ${
                dentalCheckupDetails.oralTissues
              }</p>
              <p><strong>Brushing Frequency:</strong> ${
                dentalCheckupDetails.brushingFrequency
              }</p>
              <p><strong>Flossing:</strong> ${dentalCheckupDetails.flossing}</p>
              <p><strong>Mouthwash:</strong> ${
                dentalCheckupDetails.mouthwash
              }</p>
            </div>
            <div style="flex: 1; min-width: 250px;">
              <p><strong>Medical Conditions:</strong> ${medicalConditions.join(
                ", "
              )}</p>
              <p><strong>Medications:</strong> ${
                dentalCheckupDetails.medications
              }</p>
              <p><strong>Medication Details:</strong> ${
                dentalCheckupDetails.medicationDetails
              }</p>
              <p><strong>Allergies:</strong> ${
                dentalCheckupDetails.allergies
              }</p>
              <p><strong>Allergy Details:</strong> ${
                dentalCheckupDetails.allergyDetails
              }</p>
              <p><strong>Previous Treatment:</strong> ${
                dentalCheckupDetails.previousTreatment
              }</p>
              <p><strong>Previous Treatment Details:</strong> ${
                dentalCheckupDetails.previousTreatmentDetails
              }</p>
              <p><strong>Symptoms:</strong> ${symptoms.join(", ")}</p>
              <p><strong>Follow-up Plan:</strong> ${
                dentalCheckupDetails.followupPlan
              }</p>
            </div>
          </div>
        `;
      } else {
        modalContent.innerHTML =
          "<p>No details available for this dental checkup form.</p>";
      }

      modal.style.display = "flex";
    })
    .catch((error) => {
      console.error("Error fetching dental checkup details:", error);
    });
}

function closeModal() {
  const modal = document.getElementById("dentalCheckupModal");
  modal.style.display = "none";
}

document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("dentalCheckupModal");
  modal.style.display = "none";
});

document.getElementById("dentalCheckupModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    const modal = document.getElementById("dentalCheckupModal");
    modal.style.display = "none";
  }
});

function updatePagination() {
  const totalPages = Math.ceil(filteredDentalCheckups.length / rowsPerPage);
  document.getElementById(
    "pageInfo"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayDentalCheckups();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredDentalCheckups.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayDentalCheckups();
  }
}

function searchCheckups() {
  const searchInput = document
    .getElementById("searchCheckup")
    .value.trim()
    .toLowerCase();

  filteredDentalCheckups = allDentalCheckups.filter((checkup) => {
    const checkupData = `${checkup.formId} ${checkup.patientName} ${checkup.treatmentDetails}`;
    return checkupData.toLowerCase().includes(searchInput);
  });

  currentPage = 1;
  displayDentalCheckups();
}
