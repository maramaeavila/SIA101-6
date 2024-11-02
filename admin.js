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
