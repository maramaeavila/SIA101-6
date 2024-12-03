// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDiOsr6bY5BDKdiBPRzDgSpurHdkkUlc3k",
  authDomain: "sia101-d60a1.firebaseapp.com",
  databaseURL: "https://sia101-d60a1-default-rtdb.firebaseio.com/",
  projectId: "sia101-d60a1",
  storageBucket: "sia101-d60a1.appspot.com",
  messagingSenderId: "258109532727",
  appId: "1:258109532727:web:73d735dc749d2cb4ebedb2",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// Function

const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eye-icon");

eyeIcon.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector("button");
  loginButton.addEventListener("click", loginUser);
});

// Connection to Database

async function loginUser(event) {
  event.preventDefault();

  const usernameElement = document.getElementById("username");
  const passwordElement = document.getElementById("password");

  if (!usernameElement || !passwordElement) {
    console.error("Username or password element not found");
    swal("Error", "Username or password field is missing", "error");
    return;
  }

  const username = usernameElement.value.trim();
  const password = passwordElement.value.trim();

  if (!username || !password) {
    swal("Error", "Please fill in all required fields.", "error");
    return;
  }

  try {
    const snapshot = await db
      .ref("3-Employees")
      .orderByChild("username")
      .equalTo(username)
      .once("value");

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0];
      const user = userData[userKey];

      if (user.password === password) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        swal("Success", "Login successful!", "success").then(() => {
          switch (user.role.toUpperCase()) {
            case "HEALTH_COMMITTEE_HEAD":
              window.location.href = "headcommittee.html";
              break;
            case "BHW":
              window.location.href = "bhw.html";
              break;
            case "DENTAL":
              window.location.href = "dental.html";
              break;
            case "GENERAL_DOCTOR":
              window.location.href = "doctor.html";
              break;
            case "MIDWIFE":
              window.location.href = "midwife.html";
              break;
            case "DNS":
              window.location.href = "dns.html";
              break;
            case "SECRETARY":
              window.location.href = "secretary.html";
              break;
            default:
              swal("Error", "Unknown role. Please contact admin.", "error");
          }
        });
      } else {
        swal("Error", "Incorrect password.", "error");
      }
    } else {
      swal("Error", "User not found. Please check your username.", "error");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    swal(
      "Error",
      "An error occurred during login. Please try again later.",
      "error"
    );
  }
}
