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

// document.getElementById("fetchDataBtn").addEventListener("click", function () {
//   var patientID = document.getElementById("patientID").value;

//   if (patientID) {
//     fetchPatientData(patientID);
//   } else {
//     alert("Please enter a Patient ID.");
//   }
// });

// function fetchPatientData(patientID) {
//   var patientRef = db.ref("5-Health-PatientID/" + patientID);

//   patientRef
//     .get()
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const patientData = snapshot.val();

//         document.getElementById("name").textContent = patientData.name;
//         document.getElementById("age").textContent = patientData.age;
//         document.getElementById("birthdate").textContent =
//           patientData.birthdate;
//         document.getElementById("address").textContent = patientData.address;
//         document.getElementById("mobileNumber").textContent =
//           patientData.mobileNumber;
//         document.getElementById("civilStatus").textContent =
//           patientData.civilStatus;
//         document.getElementById("sex").textContent = patientData.sex;
//         document.getElementById("status").textContent = patientData.status;

//         document.getElementById("residentData").style.display = "block";
//         document.getElementById("patientIDHidden").value = patientID;
//       } else {
//         alert("No data found for this Patient ID.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching patient data:", error);
//       alert("Failed to fetch patient data.");
//     });
// }

// document
//   .getElementById("healthForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     var patientID = document.getElementById("patientIDHidden").value;
//     var healthCondition = document.getElementById("healthCondition").value;
//     var precheckupNotes = document.getElementById("precheckupNotes").value;

//     if (!healthCondition || !precheckupNotes) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     var healthData = {
//       healthCondition: healthCondition,
//       precheckupNotes: precheckupNotes,
//       timestamp: new Date().toISOString(),
//     };

//     db.ref("5-Health-Precheckup/" + patientID)
//       .push(healthData)
//       .then(() => {
//         alert("Information saved successfully.");
//         document.getElementById("healthForm").reset();
//       })
//       .catch((error) => {
//         console.error("Error saving data:", error);
//         alert("Failed to save data.");
//       });
//   });

document.querySelectorAll(".nav-item a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelectorAll(".content-section").forEach((section) => {
      section.style.display = "none";
    });

    const sectionId =
      link.textContent.trim().toLowerCase().replace(/\s+/g, "") + "Section";
    const sectionElement = document.getElementById(sectionId);

    if (sectionElement) {
      sectionElement.style.display = "block";
    } else {
      console.log("Section not found:", sectionId);
    }

    if (link.textContent.trim() === "Personal Information") {
      fetchPatientData();
    } else if (link.textContent.trim() === "Records") {
      fetchPatientRecords();
    } else if (link.textContent.trim() === "Medicine") {
      fetchMedicineData();
    }
  });
});

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
