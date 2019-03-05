const ref = firebase.database().ref()
const firebaseAuth = firebase.auth

document.getElementById("submit").addEventListener('click', sendInfo)

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        setTimeout(() => {
            window.location.href="panel.html"
        }, 1000);
    }
    else{
    document.getElementById("preloader").style.display="none";
    }
});

var format = /[\.@#$\[\]]/;

function sendInfo(){
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    ref.child(`users/${username}`).once("value",snapshot => {
        if (snapshot.exists() || username.length<3 || format.test(username) == true){
            document.getElementById("errorMsg").style.color="white"
            if(username.length<3){
                document.getElementById("errorMsg").innerHTML = "Username need to have at least 3 characters"
            }
            else if(format.test(username) === true){
                document.getElementById("errorMsg").innerHTML = "Username can't contain special characters"
            }
            else{
                document.getElementById("errorMsg").innerHTML = "Username already exists"
            }
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(()=>{
                    user = firebase.auth().currentUser;
                        user.updateProfile({
                            displayName: username
                        })
                    .catch(function(error) {
                        console.log(error)
                    });
                    ref.child(`users/${username}/info`)
                    .set({
                      username:username,
                      email,email,
                      password:password
                    })
                    document.getElementById("errorMsg").style.color="green"
                    document.getElementById("errorMsg").innerHTML = "Register successful"
                })
                .catch(function(error) {
                    let errorMessage = error.message;
                    document.getElementById("errorMsg").style.color="white"
                    document.getElementById("errorMsg").innerHTML = errorMessage
                    document.getElementById("succesMsg").style.display="none"
                })
        }
    });
}
