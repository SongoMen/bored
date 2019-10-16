const ref = firebase.database().ref();
var popup = document.getElementById("popup");
var popupRequests = document.getElementById("requests");
var bg = document.getElementById("bg");
var friends = [],
  last;

firebase.auth().onAuthStateChanged(function(user) {
  var user = firebase.auth().currentUser.displayName;

  if (user) {
    document.getElementById("leftbar__username").innerHTML = user;
    document.getElementById("leftbar__username1").innerHTML = user;
    getFriends();
    checkRequests();
    setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
    }, 1000);
  } else {
    window.location.href = "login.html";
  }
});

document.getElementById("popup__cancel").addEventListener("click", function() {
  popup.style.opacity = "0";
  bg.style.opacity = "0";
  setTimeout(() => {
    popup.style.display = "none";
    bg.style.display = "none";
  }, 500);
});
document
  .getElementById("requests__cancel")
  .addEventListener("click", function() {
    popupRequests.style.opacity = "0";
    bg.style.opacity = "0";
    setTimeout(() => {
      popupRequests.style.display = "none";
      bg.style.display = "none";
    }, 500);
  });
document.getElementById("friends__add").addEventListener("click", function() {
  if (popup.style.display === "flex") {
    popup.style.opacity = "0";
    bg.style.opacity = "0";
    setTimeout(() => {
      popup.style.display = "none";
      bg.style.display = "none";
    }, 500);
  } else {
    popup.style.display = "flex";
    bg.style.display = "block";
    setTimeout(() => {
      popup.style.opacity = "1";
      bg.style.opacity = ".7";
    }, 200);
  }
});
document.getElementById("popup__search").addEventListener("click", addFriends);

setTimeout(() => {
  if (
    document
      .getElementById("friends__buttons")
      .contains(document.getElementById("friends__invites"))
  ) {
    document
      .getElementById("friends__invites")
      .addEventListener("click", getRequests);
    clearTimeout();
  }
}, 2000);

function getRequests() {
  document.getElementById("requests__list").innerHTML = "";
  let appendDiv;
  popupRequests.style.display = "flex";
  bg.style.display = "block";
  setTimeout(() => {
    popupRequests.style.opacity = "1";
    bg.style.opacity = ".7";
  }, 200);
  for (let i = 0; i < friends.length; i++) {
    appendDiv = `<div class="requests__user" id=${friends[parseInt(i)]}>
			<h3>${friends[parseInt(i)]}</h3>
			<div class="requests__buttons">
			<button onClick = "acceptOrDecline(this)" class="accept ${
        friends[parseInt(i)]
      }" type="button">Accept</button>
			<button onClick = "acceptOrDecline(this)" class="decline ${
        friends[parseInt(i)]
      }" type="button">Decline</button>
			</div>
			</div>`;
    $("#requests__list").append(appendDiv);
  }
}

function removeFriends(name) {
  var user = firebase.auth().currentUser.displayName;
  let name1 = name.animVal.split(" ");
  ref.child(`users/${user}/friends/${name1[1]}`).remove();
  ref.child(`users/${name1[1]}/friends/${user}`).remove();
  getFriends();
}

function acceptOrDecline(name) {
  var user = firebase.auth().currentUser.displayName;
  let name1 = name.className.split(" ");
  let username = name1[1];
  if (name1[0] === "accept") {
    ref
      .child(`users/${user}/recivedRequests/${username}`)
      .remove()
      .then(() => {
        ref.child(`users/${username}/sentRequests/${user}`).remove();
        ref.child(`users/${user}/friends/${username}`).update({
          name: name1[1]
        });
        ref.child(`users/${username}/friends/${user}`).update({
          name: user
        });
      });
  } else {
    ref.child(`users/${user}/recivedRequests/${username}`).remove();
    ref.child(`users/${username}/sentRequests/${user}`).remove();
  }
  $("#" + name1[1]).remove();
  getFriends();
  checkRequests();
}

function friendRequest(cl) {
  let user = firebase.auth().currentUser.displayName;
  let username = cl.className;
  ref.child(`users/${user}/sentRequests/${username}`).update({
    username
  });
  ref.child(`users/${username}/recivedRequests/${user}`).update({
    user
  });
  $("." + username).html("Request sent");
}

function checkRequests() {
  let user = firebase.auth().currentUser.displayName;
  let requests = 0;
  let invites;
  let notification;
  ref
    .child(`users/${user}/recivedRequests`)
    .once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        let key = childSnapshot.key;
        friends.push(key);
        requests++;
      });
      if (requests > 0) {
        if (requests === 1) {
          notification = "1 FRIEND REQUEST";
        } else {
          notification = requests + " FRIEND REQUESTS";
        }
        invites = `<button id="friends__invites" class="friends__invites" type="button"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="510px" height="510px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve">
				<g>
					<g id="notifications-none">
						<path d="M255,510c28.05,0,51-22.95,51-51H204C204,487.05,226.95,510,255,510z M420.75,357V216.75    c0-79.05-53.55-142.8-127.5-160.65V38.25C293.25,17.85,275.4,0,255,0c-20.4,0-38.25,17.85-38.25,38.25V56.1    c-73.95,17.85-127.5,81.6-127.5,160.65V357l-51,51v25.5h433.5V408L420.75,357z M369.75,382.5h-229.5V216.75    C140.25,153,191.25,102,255,102s114.75,51,114.75,114.75V382.5z" />
					</g>
				</g>
				</svg>${notification}</button>`;
        $("#friends__buttons").append(invites);
      }
      requests = 0;
    });
}

function getFriends() {
  document.getElementById("friends__fullList").innerHTML = "";
  let user = firebase.auth().currentUser.displayName;
  let friendsNumber = 0;
  ref
    .child(`users/${user}/friends`)
    .once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        friendsNumber++;
        let key = childSnapshot.key;
        ref
          .child(`users/${key}/info`)
          .once("value")
          .then(function(snapshot) {
            let childData = snapshot.val();
            last = childData.lastOnline;
            let friend = `<div class="friends__user">
					<svg class="friends__remove ${key}" onclick = "removeFriends(this.className)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 47.971 47.971" style="margin-left:auto;" xml:space="preserve">
<g>
	<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" />
</g>
</svg>
					<h3>${key}</h3>
					<h5>Last online: ${last}</h5>
					<button class="friends__message ${key}" type="button"><svg viewBox="0 -26 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m256 100c-5.519531 0-10 4.480469-10 10s4.480469 10 10 10 10-4.480469 10-10-4.480469-10-10-10zm0 0"/><path d="m90 280c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10-10 4.480469-10 10 4.480469 10 10 10zm0 0"/><path d="m336 0c-90.027344 0-163.917969 62.070312-169.632812 140.253906-85.738282 4.300782-166.367188 66.125-166.367188 149.746094 0 34.945312 13.828125 68.804688 39 95.632812 4.980469 20.53125-1.066406 42.292969-16.070312 57.296876-2.859376 2.859374-3.714844 7.160156-2.167969 10.898437 1.546875 3.734375 5.191406 6.171875 9.238281 6.171875 28.519531 0 56.003906-11.183594 76.425781-30.890625 19.894531 6.78125 45.851563 10.890625 69.574219 10.890625 90.015625 0 163.898438-62.054688 169.628906-140.222656 20.9375-.929688 42.714844-4.796875 59.945313-10.667969 20.421875 19.707031 47.90625 30.890625 76.425781 30.890625 4.046875 0 7.691406-2.4375 9.238281-6.171875 1.546875-3.738281.691407-8.039063-2.167969-10.898437-15.003906-15.003907-21.050781-36.765626-16.070312-57.296876 25.171875-26.828124 39-60.6875 39-95.632812 0-86.886719-86.839844-150-176-150zm-160 420c-23.601562 0-50.496094-4.632812-68.511719-11.800781-3.859375-1.539063-8.269531-.527344-11.078125 2.539062-12.074218 13.199219-27.773437 22.402344-44.878906 26.632813 9.425781-18.058594 11.832031-39.347656 6.097656-59.519532-.453125-1.589843-1.292968-3.042968-2.445312-4.226562-22.6875-23.367188-35.183594-53.066406-35.183594-83.625 0-70.46875 71.4375-130 156-130 79.851562 0 150 55.527344 150 130 0 71.683594-67.289062 130-150 130zm280.816406-186.375c-1.152344 1.1875-1.992187 2.640625-2.445312 4.226562-5.734375 20.171876-3.328125 41.460938 6.097656 59.519532-17.105469-4.226563-32.804688-13.433594-44.878906-26.632813-2.808594-3.0625-7.21875-4.078125-11.078125-2.539062-15.613281 6.210937-37.886719 10.511719-58.914063 11.550781-2.921875-37.816406-21.785156-73.359375-54.035156-99.75h130.4375c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10h-161.160156c-22.699219-11.554688-48.1875-18.292969-74.421875-19.707031 5.746093-67.164063 70.640625-120.292969 149.582031-120.292969 84.5625 0 156 59.53125 156 130 0 30.558594-12.496094 60.257812-35.183594 83.625zm0 0"/><path d="m256 260h-126c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h126c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10zm0 0"/><path d="m256 320h-166c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h166c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10zm0 0"/><path d="m422 100h-126c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h126c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10zm0 0"/></svg>Message</button>
				</div>`;
            $("#friends__fullList").append(friend);
          });
      });
      if (friendsNumber === 0) {
        let noFriends = '<div class="friends__noFriends">You don"t have anyone on your friend list.</div>';
        $("#friends__fullList").append(noFriends);
      }
    });
}

function addFriends() {
  let user = firebase.auth().currentUser.displayName;
  document.getElementById("friends__list").innerHTML = "";
  let friendsInput = document.getElementById("friends__searchBar").value;
  let friendsNumber = 0;
  let friends;
  ref
    .child("users/")
    .once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.key === friendsInput && friendsInput !== user) {
          friendsNumber++;
          friends = `<div class="friends__user">
                    <h3>${childSnapshot.key}</h3>
                    <button onClick = "friendRequest(this)" class="${childSnapshot.key}" id="friends__add" type="button"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="357px" height="357px" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve">
                        <g>
                            <g id="add">
                                <path d="M357,204H204v153h-51V204H0v-51h153V0h51v153h153V204z" />
                            </g>
                        </g>
                        </svg>Send request</button>
					</div>`;
          $("#friends__list").append(friends);
        }
      });
      if (friendsNumber === 0) {
        document.getElementById("friends__list").innerHTML = "";
        friends = `<div class="popup__find">Couldn't find anyone with this username.</div>`;
        $("#friends__list").append(friends);
      }
      friendsNumber = 0;
    });
}
