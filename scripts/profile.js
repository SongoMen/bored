const ref = firebase.database().ref();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    let user = firebase.auth().currentUser.displayName;
    document.getElementById("leftbar__username").innerHTML = user;
    document.getElementById("leftbar__username1").innerHTML = user;

    ref
      .child(`users/${user}/info/`)
      .once("value")
      .then(function(snapshot) {
        let createdDate = snapshot.child("createdDate").val();
        let email = snapshot.child("email").val();

        document.getElementById(
          "profile__createdDate"
        ).innerHTML = `Account created on ${createdDate}`;
        document.getElementById("profile__email").innerHTML = `Email: ${email}`;
      });

    document.getElementById("profile__username").innerHTML = user;
    setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
    }, 1000);
  } else {
    window.location.href = "login.html";
  }
});
