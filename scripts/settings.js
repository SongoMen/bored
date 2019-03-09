firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		var user = firebase.auth().currentUser.displayName;
		document.getElementById("leftbar__username").innerHTML = user
		setTimeout(() => {
			document.getElementById("preloader").style.display = "none";
		}, 1000);
	}
	else{
		window.location.href="login.html"
	}

});