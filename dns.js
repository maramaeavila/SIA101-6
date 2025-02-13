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
    } else if (sectionName === "Resident List") {
      document.getElementById("residentSection").style.display = "block";
      fetchResidentData();
    } else if (sectionName === "Appointment") {
      document.getElementById("appointmentSection").style.display = "block";
    } else if (sectionName === "Form") {
      document.getElementById("formSection").style.display = "block";
    } else if (sectionName === "Medicine") {
      document.getElementById("medicineSection").style.display = "block";
    } else if (sectionName === "Medicine Release") {
      document.getElementById("medicineReleaseSection").style.display = "block";
    } else if (sectionName === "Time In/Time Out") {
      document.getElementById("timeInOutSection").style.display = "block";
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

let allResidents = [];
let filteredResidents = [];
let currentPage = 1;
const rowsPerPage = 10;

function fetchResidentData() {
  const residentListBody = document.getElementById("residentListData");
  residentListBody.innerHTML = "";

  db.ref("Residents")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        allResidents = [];
        snapshot.forEach((childSnapshot) => {
          const resident = childSnapshot.val();

          const residentData = {
            id: childSnapshot.key,
            name: `${resident.firstName || ""} ${resident.middleName || ""} ${
              resident.lastName || ""
            }`,
            mobileNumber: resident.mobileNumber || "",
            address: resident.address || "",
            age: resident.age || "",
            sex: resident.sex || "",
            birthdate: resident.birthdate || "",
            bloodType: resident.bloodType || "",
            email: resident.email || "",
            emergencyName: resident.emergencyFirstName || "",
            emergencyMobile: resident.emergencyMobileNumber || "",
            emergencyRelationship: resident.emergencyRelationship || "",
          };

          allResidents.push(residentData);
        });

        filteredResidents = [...allResidents];
        displayResidents();
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

function displayResidents() {
  const residentListBody = document.getElementById("residentListData");
  residentListBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedResidents = filteredResidents.slice(start, end);

  if (paginatedResidents.length > 0) {
    paginatedResidents.forEach((resident) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${resident.id}</td>
        <td>${resident.name}</td>
        <td>${resident.mobileNumber}</td>
        <td>${resident.email}</td>
      `;

      row.addEventListener("click", () => openModal(resident));

      residentListBody.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No residents found for this page.</td>`;
    residentListBody.appendChild(row);
  }

  updatePagination();
}

function openModal(resident) {
  const modal = document.getElementById("residentModal");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = `
    <p><strong>ID:</strong> ${resident.id}</p>
    <p><strong>Name:</strong> ${resident.name}</p>
    <p><strong>Mobile Number:</strong> ${resident.mobileNumber}</p>
    <p><strong>Address:</strong> ${resident.address}</p>
    <p><strong>Age:</strong> ${resident.age}</p>
    <p><strong>Sex:</strong> ${resident.sex}</p>
    <p><strong>Birthdate:</strong> ${resident.birthdate}</p>
    <p><strong>Blood Type:</strong> ${resident.bloodType}</p>
    <p><strong>Email:</strong> ${resident.email}</p>
    <p><strong>Emergency Contact Name:</strong> ${resident.emergencyName}</p>
    <p><strong>Emergency Contact Mobile:</strong> ${resident.emergencyMobile}</p>
    <p><strong>Emergency Contact Relationship:</strong> ${resident.emergencyRelationship}</p>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("residentModal");
  modal.style.display = "none";
}

function updatePagination() {
  const totalPages = Math.ceil(filteredResidents.length / rowsPerPage);
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function nextPage() {
  const totalPages = Math.ceil(filteredResidents.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayResidents();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayResidents();
  }
}

function searchResidents() {
  const searchInput = document
    .getElementById("searchResident")
    .value.trim()
    .toLowerCase();

  filteredResidents = allResidents.filter((resident) => {
    const residentData = `${resident.name} ${resident.mobileNumber} ${resident.email}`;
    return residentData.toLowerCase().includes(searchInput);
  });

  currentPage = 1;
  displayResidents();
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
          listItem.innerText = `${appointment.appointmentTime} - ${appointment.healthService} with ${healthcareProvider} (${appointment.status}) - ${appointment.healthService}`;
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

    const guidelinesTabContent = document.getElementById("guidelinesTabPane");
    if (guidelinesTabContent) {
      guidelinesTabContent.classList.remove("show", "active");
    }
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

function fetchInventory() {
  const inventoryList = document
    .getElementById("inventoryList")
    .getElementsByTagName("tbody")[0];

  inventoryList.innerHTML = "";

  db.ref("6-Inventory")
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const inventoryData = {};

        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          const key = `${item.category}-${item.name}`;

          if (!inventoryData[key]) {
            inventoryData[key] = item;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.category}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${new Date(item.timestamp).toLocaleDateString()}</td>
                <td>${item.expirationDate}</td>
                <td>
                  <button class="btn btn-primary" onclick="openReleaseModal('${
                    item.name
                  }')">Release</button>
                </td>
              `;

            inventoryList.appendChild(row);
          }
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='6'>No inventory found.</td>";
        inventoryList.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching inventory:", error);
      swal("Error", "Failed to load inventory.", "error");
    });
}

function openReleaseModal(itemName) {
  const releaseModal = document.getElementById("medicineReleaseModal");
  const batchDetails = document.getElementById("batchDetails");

  batchDetails.innerHTML = "";

  const lowStockThreshold = 20;

  db.ref("6-Inventory")
    .orderByChild("name")
    .equalTo(itemName)
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();

        if (item.name === itemName) {
          const row = document.createElement("div");
          row.classList.add("stock-row");
          row.innerHTML = `
            <p style="font-weight: bold;">Batch Date: ${new Date(
              item.dateAdded
            ).toLocaleDateString()}</p>
            <p style="font-weight: bold;">Quantity Available: ${
              item.quantity
            }</p>
            <input type="number" id="releaseQuantity_${
              childSnapshot.key
            }" max="${
            item.quantity
          }" placeholder="Enter quantity to release" required>
          `;
          batchDetails.appendChild(row);

          if (item.quantity < lowStockThreshold) {
            swal({
              title: "Low Stock Alert",
              text: `Stock for ${item.name} is low! Only ${item.quantity} units available.`,
              icon: "warning",
              buttons: ["Cancel", "Release"],
            }).then((willRelease) => {
              if (willRelease) {
                console.log("Proceeding with stock release...");
              }
            });
          }
        }
      });

      releaseModal.style.display = "flex";
    })
    .catch((error) => {
      console.error("Error fetching inventory item:", error);
      swal("Error", "Failed to load stock details.", "error");
    });
}

function handleMedicineRelease() {
  const residentId = document.getElementById("residentId").value;
  let releaseSuccess = true;

  const batchDetails = document.getElementById("batchDetails");
  const releaseRequests = [];

  batchDetails.querySelectorAll(".stock-row").forEach((row) => {
    const batchId = row.querySelector("input").id.split("_")[1];
    const releaseQuantity = parseInt(row.querySelector("input").value);

    if (releaseQuantity && releaseQuantity > 0) {
      releaseRequests.push({
        batchId,
        quantity: releaseQuantity,
      });
    }
  });

  if (!residentId || releaseRequests.length === 0) {
    swal(
      "Error",
      "Please fill in all required fields and select quantities to release.",
      "error"
    );
    return;
  }

  releaseRequests.forEach((request) => {
    db.ref(`6-Inventory/${request.batchId}`)
      .once("value")
      .then((snapshot) => {
        const item = snapshot.val();

        if (item.quantity >= request.quantity) {
          const newQuantity = item.quantity - request.quantity;

          db.ref(`6-Inventory/${request.batchId}`).update({
            quantity: newQuantity,
          });

          const releaseData = {
            residentId,
            itemName: item.name,
            quantity: request.quantity,
            releaseDate: new Date().toISOString(),
          };

          db.ref("6-MedicineReleases")
            .push(releaseData)
            .catch((error) => {
              console.error("Error recording release:", error);
              swal("Error", "Failed to record release transaction.", "error");
            });
        } else {
          swal(
            "Error",
            `Insufficient stock in the batch for ${item.name}.`,
            "error"
          );
          releaseSuccess = false;
        }
      });
    // .catch((error) => {
    //   console.error("Error fetching item:", error);
    //   swal("Error", "Failed to fetch item data.", "error");
    //   releaseSuccess = false;
    // });
  });

  if (releaseSuccess) {
    swal("Success", "Medicine released successfully!", "success");
    fetchInventory();
    closeReleaseModal();
  }
}

function closeReleaseModal() {
  document.getElementById("medicineReleaseModal").style.display = "none";
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

let currentPages = 1;
const rowsPerPages = 10;
let medicineReleases = [];
let filteredMedicineReleases = [];

// Fetch and Populate Medicine Release Records
function fetchMedicineReleases() {
  db.ref("6-MedicineReleases").once("value", (snapshot) => {
    medicineReleases = [];
    snapshot.forEach((childSnapshot) => {
      medicineReleases.push(childSnapshot.val());
    });
    filteredMedicineReleases = [...medicineReleases]; // Default filter is all records
    displayMedicineReleases();
  });
}

// Search Medicine Releases
function searchMedicineReleases() {
  const searchTerm = document
    .getElementById("searchMedicineRelease")
    .value.toLowerCase();
  filteredMedicineReleases = medicineReleases.filter(
    (release) =>
      release.residentId.toLowerCase().includes(searchTerm) ||
      release.itemName.toLowerCase().includes(searchTerm) ||
      new Date(release.releaseDate)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchTerm)
  );
  currentPage = 1; // Reset to first page
  displayMedicineReleases();
}

// Display Medicine Release Records
function displayMedicineReleases() {
  const tableBody = document.getElementById("medicineReleaseListData");
  tableBody.innerHTML = "";

  const start = (currentPages - 1) * rowsPerPages;
  const end = start + rowsPerPages;
  const paginatedRecords = filteredMedicineReleases.slice(start, end);

  if (paginatedRecords.length > 0) {
    paginatedRecords.forEach((record, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${start + index + 1}</td>
          <td>${record.residentId}</td>
          <td>${record.itemName}</td>
          <td>${record.quantity}</td>
          <td>${new Date(record.releaseDate).toLocaleDateString()}</td>
        `;
      tableBody.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">No records found.</td>`;
    tableBody.appendChild(row);
  }

  updatePagination();
}

// Update Pagination Controls
function updatePagination() {
  const totalPages = Math.ceil(filteredMedicineReleases.length / rowsPerPages);
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.innerText = `Page ${currentPages} of ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPages === 1;
  document.getElementById("nextPage").disabled = currentPages === totalPages;
}

function nextPage() {
  const totalPages = Math.ceil(filteredMedicineReleases.length / rowsPerPages);
  if (currentPages < totalPages) {
    currentPages++;
    displayMedicineReleases();
  }
}

function prevPage() {
  if (currentPages > 1) {
    currentPages--;
    displayMedicineReleases();
  }
}

// Initialize Medicine Releases Display
document.addEventListener("DOMContentLoaded", fetchMedicineReleases);

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
