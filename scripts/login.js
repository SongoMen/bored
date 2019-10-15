const firebaseAuth = firebase.auth;

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  firebaseAuth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "panel.html";
    })
    .catch(() => {
      document.getElementById("errorMsg").innerHTML = "Wrong email or password";
    });
}

document.getElementById("submit").addEventListener("click", login);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.href = "panel.html";
  } else {
    document.getElementById("preloader").style.display = "none";
  }
});
