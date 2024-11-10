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

function toggleDepartment() {
  const userType = getElementVal("userType");
  document.getElementById("departmentDiv").style.display =
    userType === "admin" ? "block" : "none";
}

function generatePatientID() {
  return Math.floor(10000 + Math.random() * 90000);
}

function validateForm(username, password, email, userType) {
  return username && password && email && userType && userTypes[userType];
}

async function submitForm() {
  const username = getElementVal("username");
  const password = getElementVal("password");
  const email = getElementVal("email");
  const userType = getElementVal("userType");
  const department = userType === "admin" ? getElementVal("department") : null;

  if (!validateForm(username, password, email, userType)) {
    swal(
      "Validation Error",
      "Please fill in all required fields correctly.",
      "error"
    );
    return;
  }

  const patientID = generatePatientID();

  const usernameExists = await checkUsernameExists(username);
  if (usernameExists) {
    swal(
      "Username Taken",
      "The username is already in use. Please choose another.",
      "error"
    );
    return;
  }

  const hashedPassword = CryptoJS.MD5(password).toString();

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

async function checkUsernameExists(username) {
  const snapshot = await db
    .ref("6-Users")
    .orderByChild("username")
    .equalTo(username)
    .once("value");
  return snapshot.exists();
}

async function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    swal("Error", "Please fill in all required fields.", "error");
    return;
  }

  const hashedInputPassword = CryptoJS.MD5(password).toString();

  try {
    const snapshot = await db
      .ref("6-Users")
      .orderByChild("username")
      .equalTo(username)
      .once("value");

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0];
      const storedHashedPassword = userData[userKey].password;
      const userType = userData[userKey].userType.toLowerCase();

      if (hashedInputPassword === storedHashedPassword) {
        swal("Success", "Login successful!", "success").then(() => {
          switch (userType) {
            case "resident":
              window.location.href = "resident.html";
              break;
            case "admin":
              window.location.href = "admin.html";
              break;
            case "bhw":
              window.location.href = "bhw.html";
              break;
            case "doctor":
              window.location.href = "doctor.html";
              break;
            case "midwife":
              window.location.href = "midwife.html";
              break;
            case "dns":
              window.location.href = "dns.html";
              break;
            default:
              swal("Error", "Unknown user type.", "error");
          }
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

// function getContactFormValue(id) {
//   const form = document.getElementById("contactForm");
//   const value = form.querySelector(`#${id}`)?.value.trim();
//   return value;
// }

// async function submitContactForm(event) {
//   event.preventDefault();

//   const name = getContactFormValue("name");
//   const email = getContactFormValue("email");
//   const contactNumber = getContactFormValue("contactNumber");
//   const message = getContactFormValue("message");

//   if (!name || !email || !contactNumber || !message) {
//     swal("Error", "Please fill in all required fields.", "error");
//     return;
//   }

//   const phonePattern = /^09\d{9}$/;
//   if (!phonePattern.test(contactNumber)) {
//     swal(
//       "Error",
//       "Please enter a valid Philippine 11-digit contact number, starting with '09'.",
//       "error"
//     );
//     return;
//   }

//   try {
//     await db.ref("6-contactMessages").push({
//       name,
//       email,
//       contactNumber,
//       message,
//       timestamp: firebase.database.ServerValue.TIMESTAMP,
//     });

//     swal("Success", "Your message has been sent successfully!", "success");

//     document.getElementById("contactForm").reset();
//   } catch (error) {
//     console.error("Error submitting contact form:", error);
//     swal("Error", "Error sending your message. Please try again.", "error");
//   }
// }

// document
//   .getElementById("contactForm")
//   .addEventListener("submit", submitContactForm);
