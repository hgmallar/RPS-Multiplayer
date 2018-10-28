var thisPlayer = 0;
var username = "";
var player1;
var player2;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDWonHRJ6h7mJDrkv3NBouR2h7aCCIA5pQ",
    authDomain: "rps-multiplayer-853ab.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-853ab.firebaseio.com",
    projectId: "rps-multiplayer-853ab",
    storageBucket: "",
    messagingSenderId: "1005093400141"
};
firebase.initializeApp(config);

firebase.database().ref("player-list").on("value", function (snap) {

    console.log(snap.val());
    if (snap.val()) {
        if (snap.val().first) {
            player1 = snap.val().first;
            $("#player-1-title").text(player1);
        }
        else {
            $(".button-group").hide();
            $("#player-1-title").text("Waiting for Player 1.");
        }

        if (snap.val().second) {
            player2 = snap.val().second;
            $("#player-2-title").text(player2);
        }
        else {
            $(".button-group").hide();
            $("#player-2-title").text("Waiting for Player 2.");
        }

        if ((snap.val().first) && (snap.val().second)) {
            $(".button-group").show();
        }
    }
});

$("#start-button").on("click", function (event) {
    event.preventDefault();

    username = $("#player-name").val().trim();
    $("#player-name").remove();
    $("#start-button").remove();

    if (player2) {
        thisPlayer = 1;
        $("#player-1-title").text(username);
        $("#player").text("Hi " + username + ". You are player " + thisPlayer + ".");
        firebase.database().ref('player-data').set({
            first: username,
            second: player2
        });
        firebase.database().ref('player-list').set({
            first: username,
            second: player2
        });
    }
    else if (player1) {
        thisPlayer = 2;
        $("#player-2-title").text(username);
        $("#player").text("Hi " + username + ". You are player " + thisPlayer + ".");
        firebase.database().ref('player-data').set({
            first: player1,
            second: username
        });
        firebase.database().ref('player-list').set({
            first: player1,
            second: username
        });
    }
    else {
        thisPlayer = 1;
        $("#player-1-title").text(username);
        $("#player").text("Hi " + username + ". You are player " + thisPlayer + ".");
        firebase.database().ref('player-data').set({
            first: username
        });
        firebase.database().ref('player-list').set({
            first: username
        });
    }

});

// Disconnect
firebase.database().ref().on("value", function (snap) {
    // if we lose network then remove this user from the list
    if (thisPlayer ===1) {
        firebase.database().ref().child("player-data").child("first").onDisconnect().remove();
        firebase.database().ref().child("player-list").child("first").onDisconnect().remove();
    }
    else if (thisPlayer === 2) {
        firebase.database().ref().child("player-data").child("second").onDisconnect().remove();
        firebase.database().ref().child("player-list").child("second").onDisconnect().remove();
    }
});
