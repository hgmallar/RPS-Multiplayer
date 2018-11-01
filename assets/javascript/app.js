
var thisPlayer = 0; //stores the player number
var username = ""; //stores the player username
var player1 = ""; //stores player1 username
var player2 = ""; //stores player2 username
var player1Wins = 0; //stores player1 wins
var player2Wins = 0; //stores player2 wins
var ties = 0; //stores ties

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

//When a new player is added or removed from player-list
firebase.database().ref("player-list").on("value", function (snap) {
    //if there's something in the database
    if (snap.val()) {
        //if there's a player1
        if (snap.val().first) {
            player1 = snap.val().first;
            $("#player-1-title").text(player1).addClass("font-weight-bold");
        }
        //if there's not a player1
        else {
            $("#player-1-title").text("Waiting for Player 1.").removeClass("font-weight-bold");
            $("#center-text").empty();
            $(".button-group2").hide();
            $(".play-again2").hide();
            $("#score").empty();
            player1 = "";
            player1Wins = 0;
            player2Wins = 0;
            ties = 0;
        }
        //if there's a player2
        if (snap.val().second) {
            player2 = snap.val().second;
            $("#player-2-title").text(player2).addClass("font-weight-bold");
        }
        //if there's not a player2
        else {
            $("#player-2-title").text("Waiting for Player 2.").removeClass("font-weight-bold");
            $("#center-text").empty();
            $(".button-group1").hide();
            $(".play-again1").hide();
            $("#score").empty();
            player2 = "";
            player1Wins = 0;
            player2Wins = 0;
            ties = 0;
        }
        //if there's a player1 and a player2
        if ((snap.val().first) && (snap.val().second)) {
            if (thisPlayer === 1) {
                $(".button-group1").show();
            }
            else {
                $(".button-group2").show();
            }
            $("#center-text").text("Make a selection.");
        }
    }
    //if there's nothing in the database
    else {
        $("#player-1-title").text("Waiting for Player 1.").removeClass("font-weight-bold");
        $("#player-2-title").text("Waiting for Player 2.").removeClass("font-weight-bold");
        $("#center-text").empty();
        player1 = "";
        player2 = "";
        player1Wins = 0;
        player2Wins = 0;
        ties = 0;
    }
});

//When player data is changed
firebase.database().ref("player-data").on("value", function (snap) {
    //if there's something in the database
    if (snap.val()) {
        //if there's a player1 and a player2
        if ((snap.val().first) && (snap.val().second)) {
            //if player1 has picked and player2 hasn't
            if ((snap.val().first.state === "picked") && (snap.val().second.state === "start")) {
                $("#center-text").text("Waiting for second player to pick.");
            }
            //if player2 has picked and player1 hasn't
            else if ((snap.val().first.state === "start") && (snap.val().second.state === "picked")) {
                $("#center-text").text("Waiting for first player to pick.");
            }
            //if player1 and player2 have picked
            else if ((snap.val().first.state === "picked") && (snap.val().second.state === "picked")) {
                $("#center-text").empty();
                var user1Text = $("<span class='font-weight-bold'>").text(snap.val().first.user);
                var user2Text = $("<span class='font-weight-bold'>").text(snap.val().second.user);
                $("#center-text").append($("<p>").append(user1Text).append(" picked " + snap.val().first.rps + "."));
                $("#center-text").append($("<p>").append(user2Text).append(" picked " + snap.val().second.rps + "."));
                //calculate score
                if (((snap.val().first.rps === "rock") && (snap.val().second.rps === "rock")) || ((snap.val().first.rps === "paper") && (snap.val().second.rps === "paper")) || ((snap.val().first.rps === "scissors") && (snap.val().second.rps === "scissors"))) {
                    $("#center-text").append($("<p>").text("Tie!"));
                    ties += 1;
                }
                else if (((snap.val().first.rps === "rock") && (snap.val().second.rps === "paper")) || ((snap.val().first.rps === "paper") && (snap.val().second.rps === "scissors")) || ((snap.val().first.rps === "scissors") && (snap.val().second.rps === "rock"))) {
                    var user2Text = $("<span class='font-weight-bold'>").text(snap.val().second.user);
                    $("#center-text").append($("<p>").append(user2Text).append(" wins!"));
                    player2Wins += 1;
                }
                else if (((snap.val().first.rps === "rock") && (snap.val().second.rps === "scissors")) || ((snap.val().first.rps === "paper") && (snap.val().second.rps === "rock")) || ((snap.val().first.rps === "scissors") && (snap.val().second.rps === "paper"))) {
                    var user1Text = $("<span class='font-weight-bold'>").text(snap.val().first.user);
                    $("#center-text").append($("<p>").append(user1Text).append(" wins!"));
                    player1Wins += 1;
                }
                //print score
                $("#score").empty();
                var paragraph = $("<p>");
                var user1Text = $("<span class='font-weight-bold'>").text(snap.val().first.user);
                var user2Text = $("<span class='font-weight-bold'>").text(snap.val().second.user);
                var tiesText = $("<span class='font-weight-bold'>").text(" Ties: ");
                paragraph.append(user1Text).append(" wins: " + player1Wins + " ").append(user2Text).append(" wins: " + player2Wins).append(tiesText).append(ties);
                $("#score").append(paragraph);
                //show play again buttons
                if (username === player1) {
                    $(".play-again1").show();
                }
                else if (username === player2) {
                    $(".play-again2").show();
                }
                //change the state in database to finished
                firebase.database().ref('player-data').child("first").set({
                    rps: "none",
                    state: "finished",
                    user: player1
                });
                firebase.database().ref('player-data').child("second").set({
                    rps: "none",
                    state: "finished",
                    user: player2
                });
            }
            //if neither player1 nor player2 has picked
            else if ((snap.val().first.state === "start") && (snap.val().second.state === "start")) {
                //show rock, paper, scissors buttons
                if (thisPlayer === 1) {
                    $(".button-group1").show();
                }
                else {
                    $(".button-group2").show();
                }
                $("#center-text").text("Make a selection.");
            }
            //player1 is ready to play again
            else if ((snap.val().first.state === "start") && (snap.val().second.state === "finished")) {
                $("#center-text").empty();
                $("#center-text").text("Waiting for second player.");
            }
            //player2 is ready to play again
            else if ((snap.val().first.state === "finished") && (snap.val().second.state === "start")) {
                $("#center-text").empty();
                $("#center-text").text("Waiting for first player.");
            }
        }
    }
});

//When button to add a new player is clicked
$("#start-button").on("click", function (event) {
    event.preventDefault();
    //Get the username from the input and remove the button
    username = $("#player-name").val().trim();
    $("#player-name").remove();
    $("#start-button").remove();
    //if there is a player2, add player1 to the database
    if (player2 != "") {
        thisPlayer = 1;
        $("#player-1-title").text(username).addClass("font-weight-bold");
        var usernameText = $("<span class='font-weight-bold'>").text(username);
        $("#player").text("Hi ");
        $("#player").append(usernameText)
        $("#player").append(". You are player " + thisPlayer + ".");
        firebase.database().ref('player-data').child("first").set({
            rps: "none",
            state: "start",
            user: username
        });
        firebase.database().ref('player-list').set({
            first: username,
            second: player2
        });
    }
    //if there is a player1, add player2 to the database
    else if (player1 != "") {
        thisPlayer = 2;
        $("#player-2-title").text(username).addClass("font-weight-bold");
        var usernameText = $("<span class='font-weight-bold'>").text(username);
        $("#player").text("Hi ");
        $("#player").append(usernameText)
        $("#player").append(". You are player " + thisPlayer + ".");
        firebase.database().ref('player-data').child("second").set({
            rps: "none",
            state: "start",
            user: username
        });
        firebase.database().ref('player-list').set({
            first: player1,
            second: username
        });
    }
    //if there are no players in the database, add player1 to the database
    else {
        thisPlayer = 1;
        $("#player-1-title").text(username).addClass("font-weight-bold");
        var usernameText = $("<span class='font-weight-bold'>").text(username);
        $("#player").text("Hi ");
        $("#player").append(usernameText)
        $("#player").append(". You are player " + thisPlayer + ".");
        firebase.database().ref('player-data').child("first").set({
            rps: "none",
            state: "start",
            user: username
        });
        firebase.database().ref('player-list').set({
            first: username
        });
    }
});

// On disconnect, remove the player and their data.
firebase.database().ref().on("value", function (snap) {
    if (thisPlayer === 1) {
        firebase.database().ref().child("player-data").child("first").onDisconnect().remove();
        firebase.database().ref().child("player-list").child("first").onDisconnect().remove();
    }
    else if (thisPlayer === 2) {
        firebase.database().ref().child("player-data").child("second").onDisconnect().remove();
        firebase.database().ref().child("player-list").child("second").onDisconnect().remove();
    }
});

//Player 1 chooses rock
$(document).on("click", "#rock1", function () {
    firebase.database().ref('player-data').child("first").set({
        rps: "rock",
        state: "picked",
        user: username
    });
    $(".button-group1").hide();
});
//Player 2 chooses rock
$(document).on("click", "#rock2", function () {
    firebase.database().ref('player-data').child("second").set({
        rps: "rock",
        state: "picked",
        user: username
    });
    $(".button-group2").hide();
});
//Player 1 chooses paper
$(document).on("click", "#paper1", function () {
    firebase.database().ref('player-data').child("first").set({
        rps: "paper",
        state: "picked",
        user: username
    });
    $(".button-group1").hide();
});
//Player 2 chooses paper
$(document).on("click", "#paper2", function () {
    firebase.database().ref('player-data').child("second").set({
        rps: "paper",
        state: "picked",
        user: username
    });
    $(".button-group2").hide();
});
//Player 1 chooses scissors
$(document).on("click", "#scissors1", function () {
    firebase.database().ref('player-data').child("first").set({
        rps: "scissors",
        state: "picked",
        user: username
    });
    $(".button-group1").hide();
});
//Player 2 chooses scissors
$(document).on("click", "#scissors2", function () {
    firebase.database().ref('player-data').child("second").set({
        rps: "scissors",
        state: "picked",
        user: username
    });
    $(".button-group2").hide();
});

//When player1 selects to play again
$(document).on("click", "#pa1", function () {
    $(".play-again1").hide();
    firebase.database().ref('player-data').child("first").set({
        rps: "none",
        state: "start",
        user: player1
    });
});

//When player2 selects to play again
$(document).on("click", "#pa2", function () {
    $(".play-again2").hide();
    firebase.database().ref('player-data').child("second").set({
        rps: "none",
        state: "start",
        user: player2
    });
});

//When button to send a new message is clicked
$("#send-text").on("click", function (event) {
    //if a username has been entered, add the message to the database
    if (username !== "") {
        var message = username + ": " + $("#input-text").val().trim();
        firebase.database().ref().child("messages").push({
            message: message
        });
    }
    //if there isn't a username, show the modal
    else {
        var paragraph = $("<p>").text("You must enter your player name before messaging.");
        $(".modal-body").append(paragraph);
        $(".modal").modal("show");
    }
    $("#input-text").val("");
});

//Upon start, and every change, print the most recent 5 messages in the database
firebase.database().ref().child("messages").limitToLast(5).on("value", function (snapshot) {
    $("#messages-area").empty();
    for (var key in snapshot.val()) {
        var paragraph = $("<p>").text(snapshot.val()[key].message);
        $("#messages-area").append(paragraph);
    }
});