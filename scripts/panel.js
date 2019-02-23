

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        setTimeout(() => {
            var user = firebase.auth().currentUser.displayName;
            document.getElementById("leftbar__username").innerHTML=user
            document.getElementById("preloader").style.display="none";
        }, 1000);
    }
  });

document.getElementById("leftbar__logout").addEventListener('click', logOut)

function logOut(){
    firebase.auth().signOut().then(function() {
        window.location.href="index.html"
      }, function(error) {
        console.log(error)
      });
}