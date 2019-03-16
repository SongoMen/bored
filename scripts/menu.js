document.getElementById("leftbar__settings").addEventListener('click', function () {
	window.location.href = "settings.html"
})
document.getElementById("leftbar__profile").addEventListener('click', function () {
	window.location.href = "profile.html"
})
document.getElementById("leftbar__dashboard").addEventListener('click', function () {
	window.location.href = "panel.html"
})
document.getElementById("leftbar__friends").addEventListener('click', function () {
	window.location.href = "friends.html"
})

document.getElementById("leftbar__logout").addEventListener('click', logOut)

function logOut() {
	firebase.auth().signOut().then(function () {
		window.location.href = "login.html"
	}, function (error) {
		console.log(error)
	});
}

document.getElementById("hamburger").addEventListener("click",openMenu)

function openMenu(){
	if(document.getElementById("hamburger").classList.contains("open")){
		document.getElementById("hamburger").classList.remove("open")
	}
	else{
		document.getElementById("hamburger").classList.add("open")
	}
}