import bcrypt from "bcrypt";

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
const db = firebase.database();

const authPasswords = {
  admin: "Admin123!",
  bhw: "BHWPassword!",
  doctor: "DoctorPass!",
  midwife: "MidwifePass!",
  dns: "DNSPass!",
};

function generateUserID(userType) {
  const prefix =
    {
      resident: "RES",
      admin: "ADM",
      bhw: "BHW",
      doctor: "DOC",
      midwife: "MID",
      dns: "DNS",
    }[userType] || "UNK";
  const uniqueID = prefix + "-" + Math.floor(1000 + Math.random() * 9000);
  return uniqueID;
}

function registerUser(
  username,
  email,
  password,
  userType,
  department,
  authPassword
) {
  const userID = generateUserID(userType);

  console.log("Registering user:", {
    username,
    email,
    password,
    userType,
    department,
  });

  bcrypt.hash(password, 12, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      alert("Error during registration. Please try again.");
      return;
    }

    const userData = {
      userID,
      username,
      email,
      password: hashedPassword,
      userType,
      department: department || "N/A",
      createdAt: new Date().toISOString(),
    };

    console.log("User data to be saved:", userData);

    db.ref("6-HealthUsers/" + userID).set(userData, function (error) {
      if (error) {
        console.error("Error saving data: ", error);
        alert("Registration failed. Please try again.");
      } else {
        alert("User registered successfully with ID: " + userID);
        console.log("User data saved successfully:", userData);
      }
    });
  });
}

document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;
    const department = document.getElementById("department")
      ? document.getElementById("department").value
      : null;
    const authPassword = document.getElementById("authPassword").value;

    if (authPasswords[userType] && authPassword !== authPasswords[userType]) {
      alert("Incorrect authentication password for " + userType + ".");
      return;
    }

    registerUser(username, email, password, userType, department);
  });
