const firebaseAuth = firebase.auth

function login(){
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    firebaseAuth().signInWithEmailAndPassword(email, password)
    .then(()=>{
        window.location.href="panel"
    })
    .catch((error)=>{
        document.getElementById("errorMsg").innerHTML = "Wrong email or password"
    })
}

document.getElementById("submit").addEventListener('click',login)