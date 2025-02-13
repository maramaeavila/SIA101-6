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
    } else if (sectionName === "Prenatal Care Records") {
      document.getElementById("familyPlanningRecords").style.display = "block";
    } else if (sectionName === "Family Planning Records") {
      document.getElementById("prenatalCareRecords").style.display = "block";
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

function validatePrenatalForm() {
  const bloodPressure = document.getElementById("bloodPressure").value;
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value;
  const fundalHeight = document.getElementById("fundalHeight").value;
  const fetalHeartTone = document.getElementById("fetalHeartTone").value;
  const currentGestation = document.getElementById("currentGestation").value;
  const pregnancyWeeks = document.getElementById("pregnancyWeeks").value;
  const dueDate = document.getElementById("dueDate").value;

  if (
    !bloodPressure ||
    !weight ||
    !height ||
    !fundalHeight ||
    !fetalHeartTone ||
    !currentGestation ||
    !pregnancyWeeks ||
    !dueDate
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

function submitPrenatalDetails() {
  if (!validatePrenatalForm()) return;

  const patientId = document.getElementById("patientId").textContent;
  const bloodPressure = document.getElementById("bloodPressure").value;
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value;
  const fundalHeight = document.getElementById("fundalHeight").value;
  const fetalHeartTone = document.getElementById("fetalHeartTone").value;
  const currentGestation = document.getElementById("currentGestation").value;
  const nausea = document.getElementById("nausea").checked ? "Yes" : "No";
  const backPain = document.getElementById("backPain").checked ? "Yes" : "No";
  const fatigue = document.getElementById("fatigue").checked ? "Yes" : "No";
  const swelling = document.getElementById("swelling").checked ? "Yes" : "No";
  const headaches = document.getElementById("headaches").checked ? "Yes" : "No";
  const smoking = document.getElementById("smokingYes").checked ? "Yes" : "No";
  const alcohol = document.getElementById("alcoholYes").checked ? "Yes" : "No";
  const caffeine = document.getElementById("caffeineYes").checked
    ? "Yes"
    : "No";
  const exercise = document.getElementById("exerciseYes").checked
    ? "Yes"
    : "No";
  const pregnancyWeeks = document.getElementById("pregnancyWeeks").value;
  const dueDate = document.getElementById("dueDate").value;

  const highBloodPressure = document.getElementById("highBloodPressure").checked
    ? "Yes"
    : "No";
  const diabetes = document.getElementById("diabetes").checked ? "Yes" : "No";
  const thyroidDisorder = document.getElementById("thyroidDisorder").checked
    ? "Yes"
    : "No";
  const heartDisease = document.getElementById("heartDisease").checked
    ? "Yes"
    : "No";
  const kidneyIssues = document.getElementById("kidneyIssues").checked
    ? "Yes"
    : "No";
  const asthma = document.getElementById("asthma").checked ? "Yes" : "No";
  const arthritis = document.getElementById("arthritis").checked ? "Yes" : "No";
  const cancer = document.getElementById("cancer").checked
    ? document.getElementById("cancerType").value
    : "None";
  const otherConditions = document.getElementById("otherConditions").checked
    ? document.getElementById("otherConditionsDetails").value
    : "None";

  const formId = `${patientId}-${Math.floor(100000 + Math.random() * 900000)}`;

  const prenatalData = {
    patientId,
    bloodPressure,
    weight,
    height,
    fundalHeight,
    fetalHeartTone,
    currentGestation,
    nausea,
    backPain,
    fatigue,
    swelling,
    headaches,
    smoking,
    alcohol,
    caffeine,
    exercise,
    pregnancyWeeks,
    dueDate,
    highBloodPressure,
    diabetes,
    thyroidDisorder,
    heartDisease,
    kidneyIssues,
    asthma,
    arthritis,
    cancer,
    otherConditions,
    formId,
    timestamp: new Date().toISOString(),
  };

  firebase
    .database()
    .ref(`6-PrenatalCare/${formId}`)
    .set(prenatalData)
    .then(() => {
      swal(
        "Success",
        `Prenatal form submitted successfully! Appointment ID: ${formId}`,
        "success"
      );
      clearForm();
    })
    .catch((error) => {
      console.error("Error submitting prenatal form: ", error);
      swal("Error", "Failed to submit the form. Please try again.", "error");
    });
}

function clearForm() {
  document.getElementById("bloodPressure").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("height").value = "";
  document.getElementById("fundalHeight").value = "";
  document.getElementById("fetalHeartTone").value = "";
  document.getElementById("currentGestation").value = "";
  document.getElementById("pregnancyWeeks").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("nausea").checked = false;
  document.getElementById("backPain").checked = false;
  document.getElementById("fatigue").checked = false;
  document.getElementById("swelling").checked = false;
  document.getElementById("headaches").checked = false;
  document.getElementById("smokingYes").checked = false;
  document.getElementById("alcoholYes").checked = false;
  document.getElementById("caffeineYes").checked = false;
  document.getElementById("exerciseYes").checked = false;
}

function submitFamilyPlan() {
  const patientIdFamilyPlan = document.getElementById(
    "patientIdInputFamilyPlan"
  ).value;
  const numChildren = document.getElementById("numChildren").value;
  const bloodPressure = document.getElementById("bloodPressure").value;
  const weight = document.getElementById("weight").value;
  const gravida = document.getElementById("gravida").value;
  const para = document.getElementById("para").value;
  const lmp = document.getElementById("lmp").value;
  const menstrualCycle = document.querySelector(
    'input[name="menstrualCycle"]:checked'
  )
    ? document.querySelector('input[name="menstrualCycle"]:checked').value
    : "";
  const hypertension = document.getElementById("hypertension").checked;
  const diabetes = document.getElementById("diabetes").checked;
  const heartDisease = document.getElementById("heartDisease").checked;
  const allergies = document.getElementById("allergies").value;
  const otherMedical = document.getElementById("otherMedical").value;
  const contraceptiveUse = document.querySelector(
    'input[name="contraceptiveUse"]:checked'
  )
    ? document.querySelector('input[name="contraceptiveUse"]:checked').value
    : "";
  const contraceptiveMethod = document.getElementById(
    "contraceptiveMethod"
  ).value;
  const consultationReason = {
    firstTimeUser: document.getElementById("firstTimeUser").checked,
    switchingMethods: document.getElementById("switchingMethods").checked,
    counseling: document.getElementById("counseling").checked,
  };
  const preferredMethods = {
    naturalFamilyPlanning: document.getElementById("naturalFamilyPlanning")
      .checked,
    barrierMethods: document.getElementById("barrierMethods").checked,
    hormonalMethods: document.getElementById("hormonalMethods").checked,
    IUD: document.getElementById("IUD").checked,
    permanentMethods: document.getElementById("permanentMethods").checked,
    othersMethod: document.getElementById("othersMethod").value,
  };
  const counselingAndEducation = {
    properUse: document.getElementById("properUse").checked,
    sideEffects: document.getElementById("sideEffects").checked,
    importanceFollowUp: document.getElementById("importanceFollowUp").checked,
  };

  const familyPlanData = {
    patientIdFamilyPlan,
    numChildren,
    bloodPressure,
    weight,
    gravida,
    para,
    lmp,
    menstrualCycle,
    hypertension,
    diabetes,
    heartDisease,
    allergies,
    otherMedical,
    contraceptiveUse,
    contraceptiveMethod,
    consultationReason,
    preferredMethods,
    counselingAndEducation,
  };

  const formId = `${patientIdFamilyPlan}-${new Date().getTime()}`;

  firebase
    .database()
    .ref(`6-FamilyPlanning/${formId}`)
    .set(familyPlanData)
    .then(() => {
      swal(
        "Success",
        `Family plan form submitted successfully! Appointment ID: ${formId}`,
        "success"
      );
      clearForms();
    })
    .catch((error) => {
      console.error("Error submitting family plan form: ", error);
      swal("Error", "Failed to submit the form. Please try again.", "error");
    });
}

function clearForms() {
  document.getElementById("numChildren").value = "";
  document.getElementById("bloodPressure").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("gravida").value = "";
  document.getElementById("para").value = "";
  document.getElementById("lmp").value = "";
  document
    .querySelectorAll('input[name="menstrualCycle"]')
    .forEach((input) => (input.checked = false));
  document.getElementById("hypertension").checked = false;
  document.getElementById("diabetes").checked = false;
  document.getElementById("heartDisease").checked = false;
  document.getElementById("allergies").value = "";
  document.getElementById("otherMedical").value = "";
  document
    .querySelectorAll('input[name="contraceptiveUse"]')
    .forEach((input) => (input.checked = false));
  document.getElementById("contraceptiveMethod").value = "";
  document.getElementById("firstTimeUser").checked = false;
  document.getElementById("switchingMethods").checked = false;
  document.getElementById("counseling").checked = false;
  document.getElementById("naturalFamilyPlanning").checked = false;
  document.getElementById("barrierMethods").checked = false;
  document.getElementById("hormonalMethods").checked = false;
  document.getElementById("IUD").checked = false;
  document.getElementById("permanentMethods").checked = false;
  document.getElementById("othersMethod").value = "";
  document.getElementById("properUse").checked = false;
  document.getElementById("sideEffects").checked = false;
  document.getElementById("importanceFollowUp").checked = false;
}

// function searchFamilyPlanning() {
//   let input = document
//     .getElementById("searchFamilyPlanning")
//     .value.toLowerCase();
//   let records = document
//     .getElementById("familyPlanningListData")
//     .getElementsByTagName("tr");
//   for (let i = 0; i < records.length; i++) {
//     let record = records[i];
//     let formId = record.cells[0].textContent.toLowerCase();
//     let patientName = record.cells[1].textContent.toLowerCase();
//     if (formId.includes(input) || patientName.includes(input)) {
//       record.style.display = "";
//     } else {
//       record.style.display = "none";
//     }
//   }
// }

// function searchPrenatal() {
//   let input = document.getElementById("searchPrenatal").value.toLowerCase();
//   let records = document
//     .getElementById("prenatalCareListData")
//     .getElementsByTagName("tr");
//   for (let i = 0; i < records.length; i++) {
//     let record = records[i];
//     let formId = record.cells[0].textContent.toLowerCase();
//     let patientName = record.cells[1].textContent.toLowerCase();
//     if (formId.includes(input) || patientName.includes(input)) {
//       record.style.display = "";
//     } else {
//       record.style.display = "none";
//     }
//   }
// }

// let currentPageFamily = 1;
// let recordsPerPageFamily = 5;

// function prevPageFamily() {
//   if (currentPageFamily > 1) {
//     currentPageFamily--;
//     loadFamilyPlanningData();
//   }
// }

// function nextPageFamily() {
//   currentPageFamily++;
//   loadFamilyPlanningData();
// }

// let currentPagePrenatal = 1;
// let recordsPerPagePrenatal = 5;

// function prevPagePrenatal() {
//   if (currentPagePrenatal > 1) {
//     currentPagePrenatal--;
//     loadPrenatalCareData();
//   }
// }

// function nextPagePrenatal() {
//   currentPagePrenatal++;
//   loadPrenatalCareData();
// }

// function loadFamilyPlanningData() {

//   const records = [
//     {
//       formId: "FP-001",
//       patientName: "Jane Doe",
//       numChildren: 2,
//       weight: "60",
//       bloodPressure: "120/80",
//       consultationReason: "First consultation",
//       preferredMethod: "Pill",
//     },
//     {
//       formId: "FP-002",
//       patientName: "John Smith",
//       numChildren: 1,
//       weight: "75",
//       bloodPressure: "130/85",
//       consultationReason: "Switching method",
//       preferredMethod: "IUD",
//     },
//   ];

//   let tableBody = document.getElementById("familyPlanningListData");
//   tableBody.innerHTML = "";

//   records
//     .slice(
//       (currentPageFamily - 1) * recordsPerPageFamily,
//       currentPageFamily * recordsPerPageFamily
//     )
//     .forEach((record) => {
//       let row = document.createElement("tr");
//       row.innerHTML = `
//           <td>${record.formId}</td>
//           <td>${record.patientName}</td>
//           <td>${record.numChildren}</td>
//           <td>${record.weight}</td>
//           <td>${record.bloodPressure}</td>
//           <td>${record.consultationReason}</td>
//           <td>${record.preferredMethod}</td>
//           <td><button onclick="viewFamilyPlanningRecord('${record.formId}')">View</button></td>
//       `;
//       tableBody.appendChild(row);
//     });

//   document.getElementById(
//     "pageInfoFamily"
//   ).textContent = `Page ${currentPageFamily}`;
// }

// function loadPrenatalCareData() {
//   const records = [
//     {
//       formId: "PN-001",
//       patientName: "Sarah Lee",
//       gestationWeeks: 20,
//       weight: "65",
//       bloodPressure: "110/70",
//       dueDate: "2025-05-10",
//       consultationReason: "Routine checkup",
//     },
//     {
//       formId: "PN-002",
//       patientName: "Michael Brown",
//       gestationWeeks: 15,
//       weight: "80",
//       bloodPressure: "125/85",
//       dueDate: "2025-06-15",
//       consultationReason: "Ultrasound",
//     },
//   ];

//   let tableBody = document.getElementById("prenatalCareListData");
//   tableBody.innerHTML = "";

//   records
//     .slice(
//       (currentPagePrenatal - 1) * recordsPerPagePrenatal,
//       currentPagePrenatal * recordsPerPagePrenatal
//     )
//     .forEach((record) => {
//       let row = document.createElement("tr");
//       row.innerHTML = `
//           <td>${record.formId}</td>
//           <td>${record.patientName}</td>
//           <td>${record.gestationWeeks}</td>
//           <td>${record.weight}</td>
//           <td>${record.bloodPressure}</td>
//           <td>${record.dueDate}</td>
//           <td>${record.consultationReason}</td>
//           <td><button onclick="viewPrenatalCareRecord('${record.formId}')">View</button></td>
//       `;
//       tableBody.appendChild(row);
//     });

//   document.getElementById(
//     "pageInfoPrenatal"
//   ).textContent = `Page ${currentPagePrenatal}`;
// }

// function viewFamilyPlanningRecord(formId) {
//   document.getElementById("familyPlanningModalContent").innerHTML = `
//       <p>Form ID: ${formId}</p>
//       <p>Patient Name: Jane Doe</p>
//       <p>Preferred Method: Pill</p>
//       <p>Consultation Reason: First consultation</p>
//   `;
//   document.getElementById("familyPlanningModal").style.display = "block";
// }

// function viewPrenatalCareRecord(formId) {
//   document.getElementById("prenatalCareModalContent").innerHTML = `
//       <p>Form ID: ${formId}</p>
//       <p>Patient Name: Sarah Lee</p>
//       <p>Gestation Weeks: 20</p>
//       <p>Due Date: 2025-05-10</p>
//   `;
//   document.getElementById("prenatalCareModal").style.display = "block";
// }

// function closeFamilyPlanningModal() {
//   document.getElementById("familyPlanningModal").style.display = "none";
// }

// function closePrenatalCareModal() {
//   document.getElementById("prenatalCareModal").style.display = "none";
// }

// loadFamilyPlanningData();
// loadPrenatalCareData();
