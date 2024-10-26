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

const userTypes = {
  resident: "Resident",
  admin: "Admin",
  bhw: "BHW",
  doctor: "Doctor",
  midwife: "Midwife",
  dns: "DNS",
};

function getElementVal(id) {
  const form = document.getElementById("registrationForm");
  const value = form.querySelector(`#${id}`)?.value.trim();
  console.log(`Value for ${id}:`, value);
  return value;
}

// Toggle department visibility based on user type
function toggleDepartment() {
  const userType = getElementVal("userType");
  document.getElementById("departmentDiv").style.display =
    userType === "admin" ? "block" : "none";
}

// Generate a random Patient ID
function generatePatientID() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Validate form fields
function validateForm(username, password, email, userType) {
  return username && password && email && userType && userTypes[userType];
}

// Submit form
async function submitForm() {
  const username = getElementVal("username");
  const password = getElementVal("password");
  const email = getElementVal("email");
  const userType = getElementVal("userType");
  const department = userType === "admin" ? getElementVal("department") : null;

  // Validate input
  if (!validateForm(username, password, email, userType)) {
    swal(
      "Validation Error",
      "Please fill in all required fields correctly.",
      "error"
    );
    return;
  }

  const patientID = generatePatientID();

  // Check if the username already exists
  const usernameExists = await checkUsernameExists(username);
  if (usernameExists) {
    swal(
      "Username Taken",
      "The username is already in use. Please choose another.",
      "error"
    );
    return;
  }

  // Hash the password using MD5
  const hashedPassword = CryptoJS.MD5(password).toString();

  // Save data to Firebase
  try {
    await db.ref(`6-Users/${patientID}`).set({
      username,
      email,
      password: hashedPassword,
      userType: userTypes[userType],
      department,
    });

    swal("Success", "You have registered successfully!", "success");

    document.getElementById("registrationForm").reset();
    toggleDepartment();
  } catch (error) {
    console.error("Error registering user:", error);
    swal("Error", "Error registering user. Please try again.", "error");
  }
}

// Function to check if a username already exists in the database
async function checkUsernameExists(username) {
  const snapshot = await db
    .ref("6-Users")
    .orderByChild("username")
    .equalTo(username)
    .once("value");
  return snapshot.exists(); // Returns true if the username exists
}

// Login function
async function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate input
  if (!username || !password) {
    swal("Error", "Please fill in all required fields.", "error");
    return;
  }

  // Hash the input password
  const hashedInputPassword = CryptoJS.MD5(password).toString();

  try {
    // Retrieve user data from Firebase
    const snapshot = await db
      .ref(`6-Users`)
      .orderByChild("username")
      .equalTo(username)
      .once("value");

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0]; // Get the first user's key
      const storedHashedPassword = userData[userKey].password;

      // Compare hashed passwords
      if (hashedInputPassword === storedHashedPassword) {
        swal("Success", "Login successful!", "success").then(() => {
          // Redirect to resident.html after confirmation
          window.location.href = "resident.html";
        });
      } else {
        swal("Error", "Incorrect password. Please try again.", "error");
      }
    } else {
      swal("Error", "User not found. Please check your username.", "error");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    swal("Error", "Error logging in. Please try again.", "error");
  }
}
