// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "pcgquiz.firebaseapp.com",
  databaseURL: "https://pcgquiz.firebaseio.com",
  projectId: "pcgquiz",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);

function authenticate(callback) {
  firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    console.log(user);
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    callback();
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});
}
