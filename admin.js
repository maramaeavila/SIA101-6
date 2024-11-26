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

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
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
    } else if (sectionName === "Resident List") {
      document.getElementById("residentSection").style.display = "block";
      fetchResidentData();
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Healthcare Workers") {
      document.getElementById("healthcareSection").style.display = "block";
      fetchHealthDepartmentEmployees();
    } else if (sectionName === "Medicine") {
      document.getElementById("medicineSection").style.display = "block";
      fetchInventory();
    } else if (sectionName === "Request") {
      document.getElementById("requestSection").style.display = "block";
      fetchRequests();
    } else if (sectionName === "Reports") {
      document.getElementById("reportSection").style.display = "block";
    } else if (sectionName === "Create Account") {
      document.getElementById("createSection").style.display = "block";
    } else if (sectionName === "Change Account") {
      document.getElementById("changeAccountSection").style.display = "block";
    }
  });
});

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
          const bloodType = resident.bloodType || "";
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
            <td>${bloodType}</td>
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

function searchResidents() {
  const searchInput = document
    .getElementById("searchResident")
    .value.trim()
    .toLowerCase();
  const residentRows = document.querySelectorAll("#residentListData tr");

  residentRows.forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    if (rowText.includes(searchInput)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
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

  const providerCounts = {};

  db.ref("6-Health-Appointments")
    .orderByChild("appointmentDate")
    .equalTo(date)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const appointment = childSnapshot.val();
          const { healthcareProvider } = appointment;

          providerCounts[healthcareProvider] =
            (providerCounts[healthcareProvider] || 0) + 1;

          const listItem = document.createElement("li");
          listItem.classList.add("appointment-item");
          listItem.innerText = `${appointment.appointmentTime} - ${appointment.healthService} with ${healthcareProvider} (${appointment.status}) - ${appointment.remarks}`;
          appointmentList.appendChild(listItem);
        });

        const totalsList = document.createElement("ul");
        totalsList.classList.add("totals-list");
        totalsList.innerHTML =
          "<strong>Total Appointments Per Healthcare Provider:</strong>";
        for (const provider in providerCounts) {
          const totalItem = document.createElement("li");
          totalItem.innerText = `${provider}: ${providerCounts[provider]} appointments`;
          totalsList.appendChild(totalItem);
        }
        appointmentList.appendChild(totalsList);
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

document.addEventListener("DOMContentLoaded", () => {
  fetchHealthDepartmentEmployees();
});

function fetchHealthDepartmentEmployees() {
  const departmentListBody = document.getElementById("departmentListData");
  departmentListBody.innerHTML = "";

  db.ref("3-Employees")
    .orderByChild("department")
    .equalTo("HEALTH_DEPARTMENT")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const employee = childSnapshot.val();
          const employeeID = childSnapshot.key;

          const row = document.createElement("tr");

          const profileImage = employee.profileUrl
            ? `<img src="${employee.profileUrl}" alt="Profile Image" style="width: 90px; height: 90px; margin: 10px;">`
            : `<i class="fa-solid fa-user" style="font-size: 80px; color: white; margin: 15%;"></i>`;

          row.innerHTML = `
            <td>${employeeID}</td>
            <td>${employee.firstName} ${employee.middleName} ${employee.lastName}</td>
            <td>${employee.contactNumber}</td>
            <td>${employee.address}</td>
            <td>${employee.email}</td>
            <td>${employee.role}</td>
            <td>${employee.status}</td>
            <td class="text-center">
              ${profileImage} <!-- Profile image or icon here -->
            </td>
            <td>
              <a href="${employee.resumeUrl}" target="_blank">View Resume</a>
            </td>
          `;
          departmentListBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="9">No employees found in Health Department.</td>`;
        departmentListBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching health department employees:", error);
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="9">Error loading data.</td>`;
      departmentListBody.appendChild(row);
    });
}

function showRequestTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tabContent) => {
    tabContent.style.display = "none";
  });

  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).style.display = "block";

  if (tabId === "requestFormContent") {
    document.getElementById("requestFormTab").classList.add("active");
  } else if (tabId === "submittedRequestsContent") {
    document.getElementById("submittedRequestsTab").classList.add("active");
    fetchRequests();
  }
}

function showRequestTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tabContent) => {
    tabContent.style.display = "none";
  });

  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).style.display = "block";

  if (tabId === "requestFormContent") {
    document
      .querySelector("button[data-tab='requestFormContent']")
      .classList.add("active");
  } else if (tabId === "submittedRequestsTab") {
    document
      .querySelector("button[data-tab='submittedRequestsTab']")
      .classList.add("active");
    fetchRequests();
  }
}

document
  .getElementById("requestForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const requesterName = document.getElementById("requesterName").value.trim();
    const requesterEmail = document
      .getElementById("requesterEmail")
      .value.trim();
    const requestType = document.getElementById("requestType").value.trim();
    const requestDescription = document
      .getElementById("requestDescription")
      .value.trim();
    const additionalComments = document
      .getElementById("additionalComments")
      .value.trim();
    const file = document.getElementById("fileUpload").files[0];

    if (
      !requesterName ||
      !requesterEmail ||
      !requestType ||
      !requestDescription
    ) {
      swal("Error", "Please fill in all required fields.", "error");
      return;
    }

    if (!file) {
      swal("Error", "Please upload a file.", "error");
      return;
    }

    const requestData = {
      name: requesterName,
      email: requesterEmail,
      type: requestType,
      description: requestDescription,
      comments: additionalComments,
      status: "Pending",
      timestamp: Date.now(),
    };

    const storageRef = storage.ref("6-requestfiles/" + file.name);
    console.log("Uploading file...");

    storageRef
      .put(file)
      .then((snapshot) => {
        console.log("File upload snapshot:", snapshot);
        return snapshot.ref.getDownloadURL();
      })
      .then((downloadURL) => {
        console.log("Download URL retrieved:", downloadURL);
        requestData.fileURL = downloadURL;
        return db.ref("6-SupplyRequests").push(requestData);
      })
      .then(() => {
        console.log("Data successfully pushed to Firebase.");
        swal("Success", "Request submitted successfully!", "success");
        document.getElementById("requestForm").reset();
        document.getElementById("fileUpload").value = "";
        showRequestTab("submittedRequestsContent");
      });
  });

function fetchRequests() {
  const requestListBody = document.getElementById("requestListBody");
  requestListBody.innerHTML = "";

  db.ref("6-SupplyRequests")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const request = childSnapshot.val();
          console.log("Fetched request:", request);

          const row = document.createElement("tr");

          console.log("File URL:", request.fileURL);

          const fileColumnContent = request.fileURL
            ? `<a href="${request.fileURL}" target="_blank">File</a>`
            : "No file uploaded";

          row.innerHTML = `
                <td>${request.name}</td>
                <td>${request.email}</td>
                <td>${request.type}</td>
                <td>${request.description}</td>
                <td>${fileColumnContent}</td>
                <td>${request.status}</td>
              `;
          requestListBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='6'>No requests found.</td>";
        requestListBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching requests:", error);
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan='6'>Error loading requests.</td>";
      requestListBody.appendChild(row);
    });
}

function showRequestTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.style.display = "none";
  });

  document.getElementById(tabId).style.display = "block";

  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");

  if (tabId === "submittedRequestsTab") {
    fetchRequests();
  }
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
