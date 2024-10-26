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

function getElementVal(id) {
  const value = document.getElementById(id).value;
  console.log(`Value for ${id}:`, value);
  return value;
}

const userTypes = {
  resident: "Resident",
  admin: "Admin",
  bhw: "BHW",
  doctor: "Doctor",
  midwife: "Midwife",
  dns: "DNS",
};

function generatePatientID() {
  return Math.floor(10000 + Math.random() * 90000);
}

document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");
  registrationForm.addEventListener("submit", submitForm);

  document.getElementById("userType").addEventListener("change", function () {
    const selectedUserType = this.value;
    const departmentDiv = document.getElementById("departmentDiv");

    if (selectedUserType === "admin") {
      departmentDiv.style.display = "block";
    } else {
      departmentDiv.style.display = "none";
    }
  });
});

function submitForm(e) {
  e.preventDefault();

  var username = getElementVal("username");
  var password = getElementVal("password");
  var email = getElementVal("email");
  var userType = getElementVal("userType");
  var department = userType === "admin" ? getElementVal("department") : null;

  if (!username || !password || !email || !userType) {
    alert("Please fill in all required fields.");
    return;
  }

  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Email:", email);
  console.log("User Type:", userType);
  console.log("Department:", department);

  var patientID = generatePatientID();

  // Save data to Firebase
  db.ref("6-Users/" + patientID)
    .set({
      username: username,
      email: email,
      password: password,
      userType: userTypes[userType],
      department: department,
    })
    .then(() => {
      console.log("User registered successfully with Patient ID:", patientID);
      alert("User registered successfully!");
      document.getElementById("registrationForm").reset();
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      alert("Error registering user. Please try again.");
    });
}
