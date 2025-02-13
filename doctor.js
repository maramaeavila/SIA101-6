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
      fetchHealthFormData();
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Consultation") {
      document.getElementById("ConsultationSection").style.display = "block";
    } else if (sectionName === "Babies Vaccination") {
      document.getElementById("VaccineSection").style.display = "block";
      // } else if (sectionName === "Babies Vaccination Records") {
      //   document.getElementById("babiesVaccineRecord").style.display = "block";
    } else if (sectionName === "Patient Records") {
      document.getElementById("generalCheckupRecords").style.display = "block";
      fetchCheckupData();
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

          if (appointment.healthcareProvider.toLowerCase().includes("doctor")) {
            const listItem = document.createElement("li");
            listItem.classList.add("appointment-item");
            listItem.innerText = `${appointment.appointmentTime} - ${appointment.healthService} with ${appointment.healthcareProvider} (${appointment.status}) - ${appointment.remarks}`;
            appointmentList.appendChild(listItem);
          }
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

function setDefaultDate() {
  const today = new Date();
  const formattedDate =
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    today.getDate().toString().padStart(2, "0") +
    "/" +
    today.getFullYear();
  document.getElementById("appointmentDatepicker").value = formattedDate;
}

function fetchAppointmentsByDate() {
  const selectedDate = document.getElementById("appointmentDatepicker").value;

  if (!selectedDate) {
    console.error("No date selected, setting to today.");
    // setDefaultDate();
    return;
  }

  const formattedDate = selectedDate;

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

      updateAppointmentDashboard(appointments);
    })
    .catch((error) => {
      console.error("Error fetching appointments: ", error);
    });
}

function updateAppointmentStatus(appointmentKey, newStatus) {
  const appointmentRef = db.ref(`6-Health-Appointments/${appointmentKey}`);

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

window.onload = function () {
  setDefaultDate();
  fetchAppointmentsByDate();
};

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

function fetchPatientBabysData() {
  const patientId = document.getElementById("patientIdInputBabys").value;

  if (patientId.trim() === "") {
    swal({
      title: "Warning",
      text: "Please enter a valid Resident ID.",
      icon: "warning",
      buttons: "OK",
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

        document.getElementById("patientIdBabys").textContent = patientId;
        document.getElementById("patientNameBabys").textContent = fullName;
        document.getElementById("patientAgeBabys").textContent =
          resident.age || "N/A";
        document.getElementById("patientSexBabys").textContent =
          resident.sex || "N/A";
        document.getElementById("patientAddressBabys").textContent =
          resident.address || "N/A";

        const patientDataSection = document.getElementById(
          "patientDataSectionBabys"
        );
        if (patientDataSection) {
          patientDataSection.style.display = "block";
        }
      } else {
        swal({
          title: "Warning",
          text: "Resident ID not found.",
          icon: "warning",
          buttons: "OK",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching resident data:", error);
      swal({
        title: "Warning",
        text: "An error occurred while loading resident data.",
        icon: "warning",
        buttons: "OK",
      });
    });
}

function fetchPatientBabysForm() {
  const patientId = document.getElementById("fetchPatientId").value;

  if (patientId.trim() === "") {
    swal({
      title: "Warning",
      text: "Please enter a valid Resident ID.",
      icon: "warning",
      buttons: "OK",
    });
    return;
  }

  db.ref(`6-BabiesVaccine/${patientId}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const babyRecords = snapshot.val();
        console.log("Baby Records:", babyRecords);

        const tableBody = document.getElementById("vaccineTableBody");
        tableBody.innerHTML = "";

        const defaultVaccines = [
          "BCG (Bacillus Calmette-Guerin)",
          "Hepatitis B",
          "Pentavalent (DPT-HepB-Hib)",
          "Oral Polio Vaccine (OPV)",
          "Rotavirus Vaccine",
          "Japanese Encephalitis (JE) Vaccine",
          "Tigdas (Measles) Vaccine",
        ];

        Object.keys(babyRecords).forEach((formId) => {
          const babyData = babyRecords[formId];
          console.log("Form ID:", formId, "Data:", babyData);

          document.getElementById("babiesName").value = babyData.name || "";
          document.getElementById("birthday").value = babyData.birthday || "";
          document.getElementById("babysheight").value = babyData.height || "";
          document.getElementById("babysweight").value = babyData.weight || "";
          document.getElementById("babystemperature").value =
            babyData.temperature || "";

          const vaccines = babyData.vaccines || {};
          defaultVaccines.forEach((vaccineName) => {
            if (!vaccines[vaccineName]) {
              vaccines[vaccineName] = { taken: false, nextVisit: "" };
            }
          });

          Object.keys(vaccines).forEach((vaccineName) => {
            const vaccineInfo = vaccines[vaccineName];

            const row = document.createElement("tr");
            const vaccineCell = document.createElement("td");
            const statusCell = document.createElement("td");
            const nextDateCell = document.createElement("td");
            const actionCell = document.createElement("td");

            vaccineCell.textContent = vaccineName;
            statusCell.textContent = vaccineInfo.taken ? "Yes" : "No";

            const nextDateInput = document.createElement("input");
            nextDateInput.type = "date";
            nextDateInput.value = vaccineInfo.nextVisit || "";
            nextDateInput.id = `nextVisit-${vaccineName}`;

            nextDateCell.appendChild(nextDateInput);

            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.onclick = () =>
              updateNextVisit(patientId, vaccineName, nextDateInput.value);

            actionCell.appendChild(updateButton);

            row.appendChild(vaccineCell);
            row.appendChild(statusCell);
            row.appendChild(nextDateCell);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
          });

          if (!babyData.vaccines) {
            db.ref(`6-BabiesVaccine/${patientId}/${formId}/vaccines`)
              .set(vaccines)
              .then(() =>
                console.log("Default vaccines added to the database.")
              )
              .catch((error) =>
                console.error("Error adding default vaccines:", error)
              );
          }
        });
      } else {
        swal({
          title: "Warning",
          text: "Baby's data not found.",
          icon: "warning",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching baby data:", error);
      swal({
        title: "Error",
        text: "An error occurred while loading baby data.",
        icon: "error",
      });
    });
}

function updateNextVisit(patientId, vaccineName, nextVisitDate) {
  if (!nextVisitDate) {
    swal({
      title: "Error",
      text: "Please select a valid next visit date.",
      icon: "error",
    });
    return;
  }

  const dbRef = db.ref(`6-BabiesVaccine/${patientId}/vaccines/${vaccineName}`);

  dbRef
    .update({ nextVisit: nextVisitDate })
    .then(() => {
      swal({
        title: "Success",
        text: `${vaccineName} next visit updated to ${nextVisitDate}.`,
        icon: "success",
      });
    })
    .catch((error) => {
      console.error("Error updating next visit date:", error);
      swal({
        title: "Error",
        text: "Failed to update next visit date. Please try again.",
        icon: "error",
      });
    });
}

function toggleCheckboxAllergies(checkedId) {
  const noAllergies = document.getElementById("noAllergies");
  const hasAllergies = document.getElementById("hasAllergies");
  const allergiesDetails = document.getElementById("allergiesDetails");

  if (checkedId === "noAllergies" && noAllergies.checked) {
    hasAllergies.disabled = true;
    allergiesDetails.disabled = true;
    allergiesDetails.value = "";
  } else if (checkedId === "hasAllergies" && hasAllergies.checked) {
    noAllergies.disabled = true;
    allergiesDetails.disabled = false;
  } else {
    noAllergies.disabled = false;
    hasAllergies.disabled = false;
    allergiesDetails.disabled = true;
    allergiesDetails.value = "";
  }
}

function toggleCheckbox(checkedId) {
  const noMedicationsCheckbox = document.getElementById("noMedications");
  const hasMedicationsCheckbox = document.getElementById("hasMedications");
  const medicationsDetailsInput = document.getElementById("medicationsDetails");

  if (checkedId === "noMedications" && noMedicationsCheckbox.checked) {
    hasMedicationsCheckbox.disabled = true;
    medicationsDetailsInput.disabled = true;
    medicationsDetailsInput.value = "";
  } else if (checkedId === "hasMedications" && hasMedicationsCheckbox.checked) {
    noMedicationsCheckbox.disabled = true;
    medicationsDetailsInput.disabled = false;
  } else {
    noMedicationsCheckbox.disabled = false;
    hasMedicationsCheckbox.disabled = false;
    medicationsDetailsInput.disabled = true;
    medicationsDetailsInput.value = "";
  }
}

function toggleVaccinationCheckbox(checkedId) {
  const vaccinatedYes = document.getElementById("vaccinatedYes");
  const vaccinatedNo = document.getElementById("vaccinatedNo");

  if (checkedId === "vaccinatedYes" && vaccinatedYes.checked) {
    vaccinatedNo.disabled = true;
  } else if (checkedId === "vaccinatedNo" && vaccinatedNo.checked) {
    vaccinatedYes.disabled = true;
  } else {
    vaccinatedYes.disabled = false;
    vaccinatedNo.disabled = false;
  }
}

function toggleBoosterCheckbox(checkedId) {
  const boosterYes = document.getElementById("boosterYes");
  const boosterNo = document.getElementById("boosterNo");

  if (checkedId === "boosterYes" && boosterYes.checked) {
    boosterNo.disabled = true;
  } else if (checkedId === "boosterNo" && boosterNo.checked) {
    boosterYes.disabled = true;
  } else {
    boosterYes.disabled = false;
    boosterNo.disabled = false;
  }
}

function toggleVaccineCheckbox(checkedId) {
  const pfizer = document.getElementById("pfizer");
  const moderna = document.getElementById("moderna");
  const astrazeneca = document.getElementById("astrazeneca");
  const sinovac = document.getElementById("sinovac");

  if (checkedId === "pfizer" && pfizer.checked) {
    moderna.disabled = true;
    astrazeneca.disabled = true;
    sinovac.disabled = true;
  } else if (checkedId === "moderna" && moderna.checked) {
    pfizer.disabled = true;
    astrazeneca.disabled = true;
    sinovac.disabled = true;
  } else if (checkedId === "astrazeneca" && astrazeneca.checked) {
    pfizer.disabled = true;
    moderna.disabled = true;
    sinovac.disabled = true;
  } else if (checkedId === "sinovac" && sinovac.checked) {
    pfizer.disabled = true;
    moderna.disabled = true;
    astrazeneca.disabled = true;
  } else {
    pfizer.disabled = false;
    moderna.disabled = false;
    astrazeneca.disabled = false;
    sinovac.disabled = false;
  }
}

function updateStatus() {
  const setStatus = (element, status, color) => {
    element.textContent = status;
    element.style.color = color;
  };

  const bloodPressure = document.getElementById("bloodPressure").value;
  const bloodPressureStatus = document.getElementById("bloodPressureStatus");
  if (bloodPressure) {
    const [systolic, diastolic] = bloodPressure.split("/").map(Number);
    if (systolic < 90 || diastolic < 60) {
      setStatus(bloodPressureStatus, "Low (hypotension)", "green");
    } else if (systolic >= 130 || diastolic >= 80) {
      setStatus(bloodPressureStatus, "High (hypertension)", "red");
    } else {
      setStatus(bloodPressureStatus, "Normal", "blue");
    }
  }

  const temperature = document.getElementById("temperature").value;
  const temperatureStatus = document.getElementById("temperatureStatus");
  if (temperature) {
    const tempValue = parseFloat(temperature);
    if (tempValue < 36.5) {
      setStatus(temperatureStatus, "Low (hypothermia)", "green");
    } else if (tempValue > 38.2) {
      setStatus(temperatureStatus, "High (fever)", "red");
    } else {
      setStatus(temperatureStatus, "Normal", "blue");
    }
  }

  const pulseRate = document.getElementById("pulseRate").value;
  const pulseRateStatus = document.getElementById("pulseRateStatus");
  if (pulseRate) {
    const pulse = parseInt(pulseRate, 10);
    if (pulse < 60) {
      setStatus(pulseRateStatus, "Low (slow heart rate)", "green");
    } else if (pulse > 100) {
      setStatus(pulseRateStatus, "High (fast heart rate)", "red");
    } else {
      setStatus(pulseRateStatus, "Normal", "blue");
    }
  }

  const respiratoryRate = document.getElementById("respiratoryRate").value;
  const respiratoryRateStatus = document.getElementById(
    "respiratoryRateStatus"
  );
  if (respiratoryRate) {
    const rate = parseInt(respiratoryRate, 10);
    if (rate < 12) {
      setStatus(respiratoryRateStatus, "Low (slow breathing)", "green");
    } else if (rate > 20) {
      setStatus(respiratoryRateStatus, "High (fast breathing)", "red");
    } else {
      setStatus(respiratoryRateStatus, "Normal", "blue");
    }
  }
}

document.getElementById("height").addEventListener("input", updateStatus);
document.getElementById("weight").addEventListener("input", updateStatus);
document
  .getElementById("bloodPressure")
  .addEventListener("input", updateStatus);
document.getElementById("temperature").addEventListener("input", updateStatus);
document.getElementById("pulseRate").addEventListener("input", updateStatus);
document
  .getElementById("respiratoryRate")
  .addEventListener("input", updateStatus);

function computeBMI() {
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  if (height && weight) {
    const bmi = (weight / (height * height)) * 10000;
    document.getElementById("bmi").textContent = bmi.toFixed(2);

    let status = "";
    if (bmi < 18.5) {
      status = "Underweight";
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

function getCheckedConditions(category) {
  const conditions = [];
  document
    .querySelectorAll(`#${category} input[type="checkbox"]:checked`)
    .forEach((checkbox) => {
      if (checkbox.id !== "n/a") {
        conditions.push(checkbox.labels[0].textContent.trim());
      }
    });
  return conditions.join(", ") || "None";
}

function getVaccineType() {
  const vaccineTypes = [];
  if (document.getElementById("pfizer").checked) vaccineTypes.push("Pfizer");
  if (document.getElementById("moderna").checked) vaccineTypes.push("Moderna");
  if (document.getElementById("astrazeneca").checked)
    vaccineTypes.push("AstraZeneca");
  if (document.getElementById("sinovac").checked) vaccineTypes.push("Sinovac");
  return vaccineTypes.join(", ") || "None";
}

function validateForm() {
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const bloodPressure = document.getElementById("bloodPressure").value;

  if (!height || !weight || !bloodPressure) {
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

function submitGeneralCheckup() {
  const patientIdInput = document.getElementById("patientIdInput").value.trim();

  if (!patientIdInput) {
    swal({
      title: "Error",
      text: "Please enter a valid Resident ID before submitting.",
      icon: "error",
      button: "OK",
    });
    return;
  }

  if (!validateForm()) return;

  const patientId = document.getElementById("patientId").textContent;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const bloodPressure = document.getElementById("bloodPressure").value;
  const temperature = document.getElementById("temperature").value;
  const pulseRate = document.getElementById("pulseRate").value;
  const respiratoryRate = document.getElementById("respiratoryRate").value;
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

  computeBMI();
  const bmi = document.getElementById("bmi").textContent;
  const bmiStatus = document.getElementById("bmiStatus").textContent;

  const commonDiseases = [];
  const diseases = [
    { id: "hypertension", label: "Hypertension" },
    { id: "animalBites", label: "Animal Bites" },
    { id: "dengue", label: "Dengue" },
    { id: "skinDiseases", label: "Skin Diseases" },
    { id: "pneumonia", label: "Pneumonia" },
    { id: "tb", label: "Tuberculosis" },
    { id: "fever", label: "Fever of Unknown Origin" },
    { id: "coughAndCold", label: "Cough and Cold" },
  ];
  diseases.forEach((disease) => {
    if (document.getElementById(disease.id).checked) {
      commonDiseases.push(disease.label);
    }
  });

  const consultation = document.getElementById("consultation").value || "None";
  const remarks = document.getElementById("remarks").value || "None";

  const formId = `${patientId}-${Math.floor(100000 + Math.random() * 900000)}`;

  const formData = {
    patientId,
    height,
    weight,
    bloodPressure,
    temperature,
    pulseRate,
    respiratoryRate,
    allergies,
    medications,
    pastMedicalHistory,
    familyHistory,
    vaccinated,
    vaccineType,
    boosterDose,
    boosterDate,
    bmi,
    bmiStatus,
    commonDiseases,
    consultation,
    remarks,
    formId,
    timestamp: new Date().toISOString(),
  };

  firebase
    .database()
    .ref(`6-GeneralCheckup/${formId}`)
    .set(formData)
    .then(() => {
      swal(
        "Success",
        `Form submitted successfully! Appointment ID: ${formId}`,
        "success"
      );
      clearForm();
    })
    .catch((error) => {
      console.error("Error submitting form: ", error);
      swal("Error", "Failed to submit the form. Please try again.", "error");
    });
}

function clearForm() {
  const textInputs = document.querySelectorAll("input[type='text'], textarea");
  textInputs.forEach((input) => (input.value = ""));

  const numberInputs = document.querySelectorAll("input[type='number']");
  numberInputs.forEach((input) => (input.value = ""));

  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.disabled = false;
  });

  const selects = document.querySelectorAll("select");
  selects.forEach((select) => (select.selectedIndex = 0));

  document.getElementById("bmi").textContent = "N/A";
  document.getElementById("bmiStatus").textContent = "N/A";
  document.getElementById("bloodPressureStatus").textContent = "";
  document.getElementById("temperatureStatus").textContent = "";
  document.getElementById("pulseRateStatus").textContent = "";
  document.getElementById("respiratoryRateStatus").textContent = "";

  toggleCheckboxAllergies();
  toggleCheckbox();

  const vaccineCheckboxes = ["pfizer", "moderna", "astrazeneca", "sinovac"];
  vaccineCheckboxes.forEach(
    (id) => (document.getElementById(id).disabled = false)
  );

  document.getElementById("vaccinatedYes").disabled = false;
  document.getElementById("vaccinatedNo").disabled = false;
  document.getElementById("boosterYes").disabled = false;
  document.getElementById("boosterNo").disabled = false;

  console.log("Form cleared successfully.");
}

function BabiesSubmitForm() {
  const patientId = document
    .getElementById("patientIdInputBabys")
    ?.value?.trim();
  const babiesName = document.getElementById("babiesName")?.value?.trim();
  const birthday = document.getElementById("birthday")?.value?.trim();
  const height = document.getElementById("babysheight")?.value?.trim();
  const weight = document.getElementById("babysweight")?.value?.trim();
  const temperature = document
    .getElementById("babystemperature")
    ?.value?.trim();

  if (
    !patientId ||
    !babiesName ||
    !birthday ||
    !height ||
    !weight ||
    !temperature
  ) {
    swal("Error", "Please fill in all required fields.", "error");
    highlightMissingFields({
      patientId,
      babiesName,
      birthday,
      height,
      weight,
      temperature,
    });
    return;
  }

  const formId = `${patientId}-${Math.floor(100000 + Math.random() * 900000)}`;

  const babyData = {
    formId: formId,
    patientId: patientId,
    name: babiesName,
    birthday: birthday,
    height: height,
    weight: weight,
    temperature: temperature,
    timestamp: new Date().toISOString(),
  };

  const dbRef = db.ref("6-BabiesVaccine").child(patientId);

  dbRef
    .once("value")
    .then((snapshot) => {
      if (snapshot.hasChild(formId)) {
        swal({
          title: "Warning",
          text: "A record for this patient already exists. Please verify before submitting.",
          icon: "warning",
        });
      } else {
        dbRef
          .child(formId)
          .set(babyData)
          .then(() => {
            swal({
              title: "Success",
              text: `Baby's vaccination data submitted successfully.\nForm ID: ${formId}`,
              icon: "success",
            });
            clearBabysForm();
          })
          .catch((error) => {
            console.error("Error submitting data:", error);
            swal({
              title: "Error",
              text: `Error submitting data. Please try again.\nForm ID: ${formId}`,
              icon: "error",
            });
          });
      }
    })
    .catch((error) => {
      console.error("Error checking for existing data:", error);
      swal({
        title: "Error",
        text: "An error occurred. Please try again.",
        icon: "error",
      });
    });
}

function highlightMissingFields(fields) {
  for (const [key, value] of Object.entries(fields)) {
    const input = document.getElementById(key);
    if (!value && input) {
      input.style.borderColor = "red";
    } else if (input) {
      input.style.borderColor = "";
    }
  }
}

function clearBabysForm() {
  swal({
    title: "Are you sure?",
    text: "This will clear all the entered data.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willClear) => {
    if (willClear) {
      document.getElementById("babiesName").value = "";
      document.getElementById("birthday").value = "";
      document.getElementById("babysheight").value = "";
      document.getElementById("babysweight").value = "";
      document.getElementById("babystemperature").value = "";

      const vaccineIds = [
        "BCG",
        "HepatitisB",
        "Pentavalent",
        "OPV",
        "Rotavirus",
        "JE",
        "Measles",
      ];

      vaccineIds.forEach((id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.checked = false;
        }
      });

      swal("Success", "Form has been reset.", "success");
    }
  });
}

let allCheckups = [];
let filteredCheckups = [];
let currentPage = 1;
const rowsPerPage = 10;

function fetchCheckupData() {
  const checkupListBody = document.getElementById("generalCheckupListData");
  checkupListBody.innerHTML = "";

  db.ref("6-GeneralCheckup")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        allCheckups = [];
        snapshot.forEach((childSnapshot) => {
          const checkup = childSnapshot.val();
          const checkupData = {
            formId: childSnapshot.key,
            height: checkup.height,
            weight: checkup.weight,
            bloodPressure: checkup.bloodPressure,
            temperature: checkup.temperature,
            vaccinated: checkup.vaccinated,
            consultation: checkup.consultation,
          };
          allCheckups.push(checkupData);
        });

        filteredCheckups = [...allCheckups];
        displayCheckups();
      } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="8">No checkup records found.</td>`;
        checkupListBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching checkup data:", error);
    });
}

function displayCheckups() {
  const checkupListBody = document.getElementById("generalCheckupListData");
  checkupListBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedCheckups = filteredCheckups.slice(start, end);

  if (paginatedCheckups.length > 0) {
    paginatedCheckups.forEach((checkup) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${checkup.formId}</td>
        <td>${checkup.height}</td>
        <td>${checkup.weight}</td>
        <td>${checkup.bloodPressure}</td>
        <td>${checkup.temperature}</td>
        <td>${checkup.vaccinated}</td>
        <td>${checkup.consultation}</td>
      `;

      row.addEventListener("click", () => openCheckupModal(checkup));

      checkupListBody.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="8">No checkups found for this page.</td>`;
    checkupListBody.appendChild(row);
  }

  updatePagination();
}

function openCheckupModal(checkup) {
  const modal = document.getElementById("checkupModal");
  const modalContent = document.getElementById("modalContent");

  const formId = checkup.formId;

  firebase
    .database()
    .ref(`6-GeneralCheckup/${formId}`)
    .once("value")
    .then((snapshot) => {
      const checkupDetails = snapshot.val();

      if (checkupDetails) {
        const pastMedicalHistory = Array.isArray(
          checkupDetails.pastMedicalHistory
        )
          ? checkupDetails.pastMedicalHistory
          : [checkupDetails.pastMedicalHistory || "None"];

        const familyHistory = Array.isArray(checkupDetails.familyHistory)
          ? checkupDetails.familyHistory
          : [checkupDetails.familyHistory || "None"];

        const commonDiseases = Array.isArray(checkupDetails.commonDiseases)
          ? checkupDetails.commonDiseases
          : [checkupDetails.commonDiseases || "None"];

        modalContent.innerHTML = `
          <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <div style="flex: 1; min-width: 250px;">
              <p><strong>Form ID:</strong> ${checkupDetails.formId}</p>
              <p><strong>Patient ID:</strong> ${checkupDetails.patientId}</p>
              <p><strong>Height:</strong> ${checkupDetails.height} cm</p>
              <p><strong>Weight:</strong> ${checkupDetails.weight} kg</p>
              <p><strong>Blood Pressure:</strong> ${
                checkupDetails.bloodPressure
              }</p>
              <p><strong>Temperature:</strong> ${
                checkupDetails.temperature
              } °C</p>
              <p><strong>Pulse Rate:</strong> ${
                checkupDetails.pulseRate
              } bpm</p>
              <p><strong>Respiratory Rate:</strong> ${
                checkupDetails.respiratoryRate
              } breaths/min</p>
              <p><strong>Allergies:</strong> ${checkupDetails.allergies}</p>
              <p><strong>Medications:</strong> ${checkupDetails.medications}</p>
            </div>
            <div style="flex: 1; min-width: 250px;">
              <p><strong>Past Medical History:</strong> ${pastMedicalHistory.join(
                ", "
              )}</p>
              <p><strong>Family History:</strong> ${familyHistory.join(
                ", "
              )}</p>
              <p><strong>Vaccinated:</strong> ${checkupDetails.vaccinated}</p>
              <p><strong>Vaccine Type:</strong> ${
                checkupDetails.vaccineType
              }</p>
              <p><strong>Booster Dose:</strong> ${
                checkupDetails.boosterDose
              }</p>
              <p><strong>Booster Date:</strong> ${
                checkupDetails.boosterDate
              }</p>
              <p><strong>BMI:</strong> ${checkupDetails.bmi} (${
          checkupDetails.bmiStatus
        })</p>
              <p><strong>Common Diseases:</strong> ${commonDiseases.join(
                ", "
              )}</p>
              <p><strong>Consultation:</strong> ${
                checkupDetails.consultation
              }</p>
              <p><strong>Remarks:</strong> ${checkupDetails.remarks}</p>
            </div>
          </div>
        `;
      } else {
        modalContent.innerHTML =
          "<p>No details available for this checkup form.</p>";
      }

      modal.style.display = "flex";
    })
    .catch((error) => {
      console.error("Error fetching checkup details:", error);
    });
}

function closeModal() {
  const modal = document.getElementById("checkupModal");
  modal.style.display = "none";
}

function updatePagination() {
  const totalPages = Math.ceil(filteredCheckups.length / rowsPerPage);
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function nextPage() {
  const totalPages = Math.ceil(filteredCheckups.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayCheckups();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayCheckups();
  }
}

function searchCheckups() {
  const searchInput = document
    .getElementById("searchCheckup")
    .value.trim()
    .toLowerCase();

  filteredCheckups = allCheckups.filter((checkup) => {
    const checkupData = `${checkup.formId} ${checkup.patientName} ${checkup.consultation}`;
    return checkupData.toLowerCase().includes(searchInput);
  });

  currentPage = 1;
  displayCheckups();
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
