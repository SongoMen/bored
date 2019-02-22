setTimeout(() => {
    var user = firebase.auth().currentUser.displayName;
    document.getElementById("userName").innerHTML=user
}, 1000);