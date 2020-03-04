//inicijalizacija baze podataka(firebase-a)
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBpTYsQAkqcX9NZlvxa5HgLUi1dhmzNIzo",
    authDomain: "owp-projekt-hoteli.firebaseapp.com",
    databaseURL: "https://owp-projekt-hoteli.firebaseio.com",
    projectId: "owp-projekt-hoteli",
    storageBucket: "owp-projekt-hoteli.appspot.com",
    messagingSenderId: "33598685690"
  };
  firebase.initializeApp(config);

  //kreiranje objekta firebase baze
var oDb = firebase.database();
var oDbHoteli = oDb.ref('Hoteli');
var oDbAdministratori=oDb.ref('Administratori');
var oDbBoravak = oDb.ref('Boravak');