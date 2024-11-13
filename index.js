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
  admin: "Admin",
  bhw: "BHW",
  doctor: "Doctor",
  midwife: "Midwife",
  dns: "DNS",
};

function openResidentLogin() {
  $("#residentLoginModal").modal("show");
}

function openDefaultLogin() {
  $("#loginModal").modal("show");
}

function openResidentCheckModal() {
  $("#residentCheckModal").modal("show");
}

async function loginResident() {
  const patientID = document.getElementById("residentID").value.trim();
  const birthday = document.getElementById("residentBirthday").value.trim();

  if (!patientID || !birthday) {
    swal("Error", "Please fill in all required fields.", "error");
    return;
  }

  try {
    const snapshot = await db
      .ref("6-Health-PatientID")
      .child(patientID)
      .once("value");

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const storedBirthday = userData.birthdate;

      if (birthday === storedBirthday) {
        swal("Success", "Resident login successful!", "success").then(() => {
          window.location.href = "resident.html";
        });
      } else {
        swal("Error", "Incorrect birthday. Please try again.", "error");
      }
    } else {
      swal(
        "Error",
        "Resident not found. Please check your PatientID.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error logging in resident:", error);
    swal("Error", "Error logging in. Please try again.", "error");
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
