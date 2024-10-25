// Firebase configuration (keep your existing config)
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

console.log(bcrypt.hashSync(password, 10)); // Check if bcrypt works

// Function to generate a random patient ID
function generatePatientID() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
}

// User types as strings
const userTypes = {
  resident: "Resident",
  admin: "Admin",
  bhw: "BHW",
  doctor: "Doctor",
  midwife: "Midwife",
  dns: "DNS",
};

// Function to handle user registration
document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10); // bcrypt to hash the password

    // Generate a random patient ID
    const patientID = generatePatientID();

    // Store user data in Firebase Realtime Database
    db.ref("6-Users/" + patientID)
      .set({
        email: email,
        password: hashedPassword,
        userType: userTypes[userType], // Use the string directly for user type
      })
      .then(() => {
        console.log("User registered successfully with Patient ID:", patientID);
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  });
