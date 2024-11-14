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
    } else if (sectionName === "Resident List") {
      document.getElementById("residentSection").style.display = "block";
      fetchResidentData();
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Form") {
      document.getElementById("formSection").style.display = "block";
    } else if (sectionName === "Medicine") {
      document.getElementById("medicineSection").style.display = "block";
      fetchInventory();
      // } else if (sectionName === "Messages") {
      //   document.getElementById("messageSection").style.display = "block";
    } else if (sectionName === "Reports") {
      document.getElementById("reportSection").style.display = "block";
    } else if (sectionName === "Change Account") {
      document.getElementById("changeAccountSection").style.display = "block";
    }
  });
});

function fetchPatients() {
  const verifiedListBody = document.getElementById("verifiedListBody");
  const pendingListBody = document.getElementById("pendingListBody");
  verifiedListBody.innerHTML = "";
  pendingListBody.innerHTML = "";

  db.ref("6-Health-PatientID")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const patient = childSnapshot.val();
          const row = document.createElement("tr");

          if (patient.status.toLowerCase() === "verified") {
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
            verifiedListBody.appendChild(row);
          } else if (patient.status.toLowerCase() === "pending") {
            row.innerHTML = `
              <td><input type="checkbox" class="selectPatient" data-id="${childSnapshot.key}"></td>
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
            pendingListBody.appendChild(row);
          }
        });
      } else {
        verifiedListBody.innerHTML =
          "<tr><td colspan='9'>No patients found.</td></tr>";
        pendingListBody.innerHTML =
          "<tr><td colspan='10'>No pending patients found.</td></tr>";
      }
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
      verifiedListBody.innerHTML =
        "<tr><td colspan='9'>Error loading patient data.</td></tr>";
      pendingListBody.innerHTML =
        "<tr><td colspan='10'>Error loading pending patient data.</td></tr>";
    });
}

function updatePatientStatus(status) {
  const selectedCheckboxes = document.querySelectorAll(
    ".selectPatient:checked"
  );

  selectedCheckboxes.forEach((checkbox) => {
    const patientId = checkbox.getAttribute("data-id");

    db.ref("6-Health-PatientID/" + patientId)
      .update({
        status: status.toUpperCase(),
      })
      .then(() => {
        console.log(`Patient ${patientId} status updated to ${status}`);
        fetchPatients();
      })
      .catch((error) => {
        console.error("Error updating patient status:", error);
      });
  });
}
function fetchResidentData() {
  const residentListBody = document.getElementById("residentListData");
  residentListBody.innerHTML = "";

  db.ref("Residents")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const resident = childSnapshot.val();

          const firstName = resident.firstName || "";
          const lastName = resident.lastName || "";
          const middleName = resident.middleName || "";
          const mobileNumber = resident.mobileNumber || "";
          const address = resident.address || "";
          const age = resident.age || "";
          const sex = resident.sex || "";
          const birthdate = resident.birthdate || "";
          const birthplace = resident.birthplace || "";
          const bloodType = resident.bloodType || "";
          const citizenship = resident.citizenship || "";
          const civilStatus = resident.civilStatus || "";
          const educationalAttainment = resident.educationalAttainment || "";
          const email = resident.email || "";
          const emergencyFirstName = resident.emergencyFirstName || "";
          const emergencyMobileNumber = resident.emergencyMobileNumber || "";
          const emergencyRelationship = resident.emergencyRelationship || "";

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${childSnapshot.key}</td>
            <td>${firstName} ${middleName} ${lastName}</td>
            <td>${mobileNumber}</td>
            <td>${address}</td>
            <td>${age}</td>
            <td>${sex}</td>
            <td>${birthdate}</td>
            <td>${birthplace}</td>
            <td>${bloodType}</td>
            <td>${citizenship}</td>
            <td>${civilStatus}</td>
            <td>${educationalAttainment}</td>
            <td>${email}</td>
            <td>${emergencyFirstName}</td>
            <td>${emergencyMobileNumber}</td>
            <td>${emergencyRelationship}</td>
          `;
          residentListBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="16">No residents found.</td>`;
        residentListBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching resident data:", error);
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="16">Error loading resident data.</td>`;
      residentListBody.appendChild(row);
    });
}

// function searchResidents() {
//   const searchTerm = document
//     .getElementById("searchResident")
//     .value.toLowerCase();
//   const residentListBody = document.getElementById("residentListData");

//   residentListBody.innerHTML = "";

//   db.ref("6-Health-ResidentID")
//     .once("value")
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         snapshot.forEach((childSnapshot) => {
//           const resident = childSnapshot.val();

//           const fieldsToSearch = [
//             resident.name,
//             resident.mobileNumber,
//             resident.address,
//             resident.age?.toString(),
//             resident.sex,
//             resident.birthdate,
//             resident.birthplace,
//             resident.bloodType,
//             resident.citizenship,
//             resident.civilStatus,
//             resident.educationalAttainment,
//             resident.email,
//             resident.emergencyContactName,
//             resident.emergencyContactMobile,
//             resident.emergencyRelationship
//           ];

//           const matchesSearch = fieldsToSearch.some((field) =>
//             field && field.toLowerCase().includes(searchTerm)
//           );

//           if (matchesSearch) {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//               <td>${childSnapshot.key}</td>
//               <td>${resident.name || "N/A"}</td>
//               <td>${resident.mobileNumber || "N/A"}</td>
//               <td>${resident.address || "N/A"}</td>
//               <td>${resident.age || "N/A"}</td>
//               <td>${resident.sex || "N/A"}</td>
//               <td>${resident.birthdate || "N/A"}</td>
//               <td>${resident.birthplace || "N/A"}</td>
//               <td>${resident.bloodType || "N/A"}</td>
//               <td>${resident.citizenship || "N/A"}</td>
//               <td>${resident.civilStatus || "N/A"}</td>
//               <td>${resident.educationalAttainment || "N/A"}</td>
//               <td>${resident.email || "N/A"}</td>
//               <td>${resident.emergencyContactName || "N/A"}</td>
//               <td>${resident.emergencyContactMobile || "N/A"}</td>
//               <td>${resident.emergencyRelationship || "N/A"}</td>
//             `;
//             residentListBody.appendChild(row);
//           }
//         });
//       } else {
//         residentListBody.innerHTML = "<tr><td colspan='16'>No residents found.</td></tr>";
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching resident data:", error);
//       residentListBody.innerHTML = "<tr><td colspan='16'>Error loading resident data.</td></tr>";
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
});

function fetchAppointmentsByDate() {
  const selectedDate = document.getElementById("appointmentDatePicker").value;
  if (!selectedDate) {
    alert("Please select a date.");
    return;
  }

  db.ref("6-Health-Appointments")
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

function showMedicineTab(tabId) {
  document.querySelectorAll(".tab-content .tab-pane").forEach((tab) => {
    tab.classList.remove("show", "active");
  });

  const activeTabContent = document.getElementById(tabId);
  activeTabContent.classList.add("show", "active");

  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  const activeTabButton = document.querySelector(`[data-tab="${tabId}"]`);
  activeTabButton.classList.add("active");

  if (tabId === "medicineTabPane") {
    fetchInventory();
  }
}

function fetchInventory() {
  const inventoryList = document.getElementById("inventoryList");
  inventoryList.innerHTML = "";

  db.ref("6-Inventory")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const inventoryData = {};

        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();

          const key = `${item.category}-${item.name}`;

          if (inventoryData[key]) {
            inventoryData[key].quantity += item.quantity;

            inventoryData[key].expirationDates.push(item.expirationDate);
          } else {
            inventoryData[key] = {
              category: item.category,
              name: item.name,
              quantity: item.quantity,
              timestamp: item.timestamp,
              expirationDates: [item.expirationDate],
            };
          }
        });

        for (const key in inventoryData) {
          const item = inventoryData[key];
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${new Date(item.timestamp).toLocaleDateString()}</td>
            <td>${item.expirationDates.join(
              ", "
            )}</td> <!-- Show all expiration dates -->
          `;
          inventoryList.appendChild(row);
        }
      } else {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='5'>No inventory found.</td>";
        inventoryList.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching inventory:", error);
      swal("Error", "Failed to load inventory.", "error");
    });
}

function handleCategoryChange() {
  const category = document.getElementById("productCategory").value;

  document.getElementById("contraceptivesType").style.display = "none";
  document.getElementById("medicineType").style.display = "none";
  document.getElementById("vaccineType").style.display = "none";

  if (category === "Contraceptives") {
    document.getElementById("contraceptivesType").style.display = "block";
  } else if (category === "Medicine") {
    document.getElementById("medicineType").style.display = "block";
  } else if (category === "Vaccine") {
    document.getElementById("vaccineType").style.display = "block";
  }
}

document
  .getElementById("addStockForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const productCategory = document.getElementById("productCategory").value;
    const productType = document.getElementById("productType").value;
    const productName = document.getElementById("productName").value;
    const stockQuantity = parseInt(
      document.getElementById("stockQuantity").value
    );
    const currentDate = document.getElementById("currentDate").value;
    const expirationDate = document.getElementById("expirationDate").value;

    if (!productName || !stockQuantity || !currentDate || !expirationDate) {
      swal("Error", "Please fill in all fields.", "error");
      return;
    }

    const stockData = {
      category: productCategory,
      productType: productType,
      name: productName,
      quantity: stockQuantity,
      dateAdded: currentDate,
      expirationDate: expirationDate,
      timestamp: Date.now(),
    };

    db.ref("6-Inventory")
      .push(stockData)
      .then(() => {
        swal("Success", "Stock added successfully!", "success");
        document.getElementById("addStockForm").reset();
        fetchInventory();
      })
      .catch((error) => {
        console.error("Error adding stock:", error);
        swal("Error", "Failed to add stock. Please try again.", "error");
      });
  });

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

function fetchPatientData() {
  const patientId = document.getElementById("patientIdInput").value;

  if (patientId.trim() === "") {
    alert("Please enter a valid Patient ID.");
    return;
  }

  db.ref(`6-Health-PatientID/${patientId}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const patientData = snapshot.val();
        document.getElementById("patientId").textContent = patientId;
        document.getElementById("patientName").textContent = patientData.name;
        document.getElementById("patientAge").textContent = patientData.age;
        document.getElementById("patientSex").textContent = patientData.sex;
        document.getElementById("patientAddress").textContent =
          patientData.address;

        document.getElementById("patientDataSection").style.display = "block";
        document.getElementById("bhcmsForm").style.display = "block";
      } else {
        alert("Patient ID not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching patient data:", error);
      alert("Error loading patient data.");
    });
}

function computeBMI() {
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  if (height && weight) {
    const bmi = (weight / (height * height)) * 10000; // BMI formula in kg/m²
    document.getElementById("bmi").textContent = bmi.toFixed(2);

    let status = "";
    if (bmi < 18.5) {
      status = "Malnourished (Underweight)";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      status = "Normal (Healthy Weight)";
    } else if (bmi >= 30) {
      status = "Obese";
    } else {
      status = "Overweight";
    }

    document.getElementById("bmiStatus").textContent = status;
  } else {
    document.getElementById("bmi").textContent = "N/A";
    document.getElementById("bmiStatus").textContent = "N/A";
  }
}

document.getElementById("height").addEventListener("input", computeBMI);
document.getElementById("weight").addEventListener("input", computeBMI);

function submitForm() {
  const patientId = document.getElementById("patientId").textContent;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const bloodPressure = document.getElementById("bloodPressure").value;
  const temperature = document.getElementById("temperature").value;
  const pulseRate = document.getElementById("pulseRate").value;
  const respiratoryRate = document.getElementById("respiratoryRate").value;
  const chiefComplaint = document.getElementById("chiefComplaint").value;

  const allergies = document.getElementById("hasAllergies").checked
    ? document.getElementById("allergiesDetails").value || "None"
    : "None";

  const medications = document.getElementById("hasMedications").checked
    ? document.getElementById("medicationsDetails").value || "None"
    : "None";

  const pastMedicalHistory = getCheckedConditions("pastMedicalHistory");
  const familyHistory = getCheckedConditions("familyHistory");

  const vaccinated = document.getElementById("vaccinatedYes").checked
    ? "Yes"
    : "No";
  const vaccineType = getVaccineType();
  const boosterDose = document.getElementById("boosterYes").checked
    ? "Yes"
    : "No";
  const boosterDate = document.getElementById("boosterDate").value;

  if (!height || !weight || !bloodPressure) {
    alert("Please fill out all required fields.");
    return;
  }

  const formId = `${patientId}-${new Date().getTime()}`;

  const formData = {
    patientId,
    height,
    weight,
    bloodPressure,
    temperature,
    pulseRate,
    respiratoryRate,
    chiefComplaint,
    allergies,
    medications,
    pastMedicalHistory,
    familyHistory,
    vaccinated,
    vaccineType,
    boosterDose,
    boosterDate,
    bmi: document.getElementById("bmi").textContent,
    formId,
    timestamp: new Date().toISOString(),
  };

  db.ref("6-Health-FormData")
    .child(formId)
    .set(formData)
    .then(() => {
      alert("Form submitted successfully!");
      console.log("Form Data saved:", formData);
    })
    .catch((error) => {
      console.error("Error saving form data:", error);
      alert("Error submitting form.");
    });
}

function getCheckedConditions(prefix) {
  const conditions = [];
  const checkboxes = document.querySelectorAll(
    `#${prefix} input[type="checkbox"]:checked`
  );
  checkboxes.forEach((checkbox) => {
    conditions.push(checkbox.id);
  });
  return conditions.join(", ");
}

function getVaccineType() {
  let vaccineType = "";
  if (document.getElementById("pfizer").checked) vaccineType += "Pfizer, ";
  if (document.getElementById("moderna").checked) vaccineType += "Moderna, ";
  if (document.getElementById("astrazeneca").checked)
    vaccineType += "AstraZeneca, ";
  if (document.getElementById("sinovac").checked) vaccineType += "Sinovac, ";
  return vaccineType ? vaccineType.slice(0, -2) : "N/A";
}
