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

// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("personalInfoSection").style.display = "block";
// });

document.querySelectorAll(".nav-item a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelectorAll(".content-section").forEach((section) => {
      section.style.display = "none";
    });

    const sectionName = link.textContent.trim();

    if (sectionName === "Personal Information") {
      document.getElementById("personalInfoSection").style.display = "block";
      fetchResidentData(residentID);
      // } else if (sectionName === "Medical History") {
      //   document.getElementById("medicalHistorySection").style.display = "block";
    } else if (sectionName === "Precheckup History") {
      document.getElementById("precheckupSection").style.display = "block";
      fetchPrecheckupDetails(residentID);
      // } else if (sectionName === "Medicine") {
      //   document.getElementById("medicineSection").style.display = "block";
    } else if (sectionName === "Logout") {
      logoutUser();
    } else {
      console.error("No matching section found for:", sectionName);
    }
  });
});

function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = "block";
  } else {
    console.error("Section not found:", sectionId);
  }
}

document.getElementById("fetchDataBtn").addEventListener("click", function () {
  var patientID = document.getElementById("patientID").value;
  if (patientID) {
    fetchResidentData(patientID);
  } else {
    alert("Please enter a Patient ID.");
  }
});

function fetchResidentData(residentID) {
  const residentRef = db.ref("Residents/" + residentID);

  residentRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const nameExtension =
          data.nameExtension && data.nameExtension.toLowerCase() !== "none"
            ? ` ${data.nameExtension}`
            : "";

        const fullName = `${data.firstName || ""} ${data.middleName || ""} ${
          data.lastName || ""
        }${nameExtension}`;

        const profilePicture = data.profileUrl || "default-profile.png";
        document.getElementById("profilePicture").src = profilePicture;

        document.getElementById("residentName").textContent = fullName.trim();
        document.getElementById("age").textContent = data.age || "N/A";
        document.getElementById("birthdate").textContent =
          data.birthdate || "N/A";
        document.getElementById("address").textContent = data.address || "N/A";
        document.getElementById("mobileNumber").textContent =
          data.mobileNumber || "N/A";
        document.getElementById("email").textContent = data.email || "N/A";
        document.getElementById("sex").textContent = data.sex || "N/A";
        document.getElementById("bloodType").textContent =
          data.bloodType || "N/A";
        document.getElementById("religion").textContent =
          data.religion || "N/A";
        document.getElementById("civilStatus").textContent =
          data.civilStatus || "N/A";

        document.getElementById("residentData").style.display = "block";
        showSection("personalInfoSection");
      } else {
        swal("Error", "No data found for this Resident ID.", "error");
      }
    })
    .catch((error) => {
      console.error("Error fetching resident data:", error);
      swal(
        "Error",
        "Failed to fetch resident data. Please try again.",
        "error"
      );
    });
}

function fetchPrecheckupDetails(residentID) {
  const precheckupRef = db.ref("6-GeneralCheckup/");

  precheckupRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const residentData = Object.keys(data).filter((key) =>
          key.startsWith(residentID)
        );

        if (residentData.length === 0) {
          swal(
            "Error",
            "No precheckup data found for this Resident ID.",
            "error"
          );
          return;
        }

        const tableBody = document.getElementById("precheckupListData");
        tableBody.innerHTML = "";

        residentData.forEach((formID) => {
          const formData = data[formID];
          const row = document.createElement("tr");

          const formIDCell = document.createElement("td");
          formIDCell.textContent = formID;
          row.appendChild(formIDCell);

          const complaintCell = document.createElement("td");
          complaintCell.textContent = formData.chiefComplaint || "N/A";
          row.appendChild(complaintCell);

          tableBody.appendChild(row);
        });

        document.getElementById("precheckupSection").style.display = "block";
      } else {
        swal("Error", "No checkup history found.", "error");
      }
    })
    .catch((error) => {
      console.error("Error fetching precheckup details:", error);
      swal(
        "Error",
        "Failed to fetch precheckup data. Please try again.",
        "error"
      );
    });
}

function fetchPatientData() {
  console.log("Fetching personal information...");
  document.getElementById("name").innerText = "John Doe";
  document.getElementById("age").innerText = "35";
  document.getElementById("birthdate").innerText = "1989-04-25";
  document.getElementById("address").innerText = "123 Main St, Cityville";
  document.getElementById("mobileNumber").innerText = "(123) 456-7890";
  document.getElementById("civilStatus").innerText = "Single";
  document.getElementById("sex").innerText = "Male";
  document.getElementById("status").innerText = "Active";
}

function fetchPatientRecords() {
  console.log("Fetching patient records...");
  document.getElementById("recordsContent").innerText =
    "Sample records for John Doe.";
}

function fetchMedicineData() {
  console.log("Fetching medicine data...");
  document.getElementById("medicineContent").innerText =
    "Sample medicine data for John Doe.";
}
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const residentID = localStorage.getItem("residentID");
    if (residentID) {
      console.log("Resident ID from localStorage:", residentID);

      fetchResidentData(residentID);
    } else {
      console.error("Resident ID not found in localStorage.");
      swal(
        "Error",
        "No resident ID found. Please contact support.",
        "error"
      ).then(() => {
        window.location.href = "index.html";
      });
    }
  } else {
  }
});

const residentID = localStorage.getItem("residentID");

if (residentID) {
  db.ref("Residents/" + residentID)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const residentData = snapshot.val();

        fetchResidentData(residentID, residentData);
      } else {
        swal("Error", "Resident data not found.", "error");
      }
    })
    .catch((error) => {
      console.error("Error fetching resident data:", error);
      swal("Error", "Failed to fetch resident data.", "error");
    });
} else {
}

document
  .getElementById("precheckupListData")
  .addEventListener("click", (event) => {
    const clickedRow = event.target.closest("tr");
    if (!clickedRow) return;

    const formID = clickedRow.cells[0].textContent;
    fetchPrecheckupFormDetails(formID);
  });

function fetchPrecheckupFormDetails(formID) {
  const formRef = db.ref("6-GeneralCheckup/" + formID);

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

        document.getElementById("precheckupDetailsSection").scrollIntoView({
          behavior: "smooth",
        });
      } else {
        swal("Error", "No details found for this Form ID.", "error");
      }
    })
    .catch((error) => {
      console.error("Error fetching precheckup form details:", error);
      swal("Error", "Failed to fetch form details. Please try again.", "error");
    });
}
