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
  const residentID = document.getElementById("residentID").value.trim();
  const birthdate = document.getElementById("residentBirthday").value.trim();

  if (!residentID || !birthdate) {
    swal("Error", "Please fill in all required fields.", "error");
    return;
  }

  try {
    const snapshot = await db.ref("Residents/" + residentID).once("value");
    if (snapshot.exists()) {
      const residentData = snapshot.val();

      if (residentData.birthdate === birthdate) {
        localStorage.setItem("residentID", residentID);

        swal("Success", "Login successful!", "success").then(() => {
          window.location.href = "resident.html";
        });
      } else {
        swal("Error", "Incorrect birthdate.", "error");
      }
    } else {
      swal("Error", "Resident ID not found.", "error");
    }
  } catch (error) {
    console.error("Error during login:", error);
    swal("Error", "Login failed. Please try again later.", "error");
  }
}

async function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value.trim().toUpperCase(); // Convert input to uppercase for comparison

  if (!username || !password || !role) {
    swal("Error", "Please fill in all required fields.", "error");
    return;
  }

  try {
    const snapshot = await db
      .ref("3-Employees")
      .orderByChild("email")
      .equalTo(username)
      .once("value");

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0];
      const user = userData[userKey];

      if (user.password === password && user.role === role) {
        // Store the logged-in user's ID in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        swal("Success", "Login successful!", "success").then(() => {
          switch (role) {
            case "HEALTH_COMMITTEE_HEAD":
              window.location.href = "admin.html";
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
            default:
              swal("Error", "Unknown role. Please contact admin.", "error");
          }
        });
      } else {
        swal("Error", "Incorrect password or role.", "error");
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

function displayLoggedInUserProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser && loggedInUser.profileUrl) {
    // If the logged-in user has a profile image, display it
    const profileImage = `<img src="${loggedInUser.profileUrl}" alt="Profile Image" style="width: 80px; height: 80px; border-radius: 50%;">`;
    document.getElementById("profileImageContainer").innerHTML = profileImage;
  } else {
    // If no profile image is found, display a default icon
    const defaultIcon = `<i class="fa-solid fa-user" style="font-size: 80px; color: white; margin: 15%;"></i>`;
    document.getElementById("profileImageContainer").innerHTML = defaultIcon;
  }
}

// Call this function when the page is loaded (for example, in the `resident.html` or `admin.html`)
window.onload = displayLoggedInUserProfile;
