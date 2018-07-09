$(document).ready(function () {
    console.log("ready!");
    var config = {
        apiKey: "AIzaSyA_GZbbjysNNSYjXHcul6qGStkdAR0Kgc0",
        authDomain: "rockpaperscissors-3a8a8.firebaseapp.com",
        databaseURL: "https://rockpaperscissors-3a8a8.firebaseio.com",
        projectId: "rockpaperscissors-3a8a8",
        storageBucket: "rockpaperscissors-3a8a8.appspot.com",
        messagingSenderId: "716590132939"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var usersRef = database.ref("/users");
    var player1Name;
    var player2Name;

    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");

    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {
            console.log(database.connections);
            // console.log(Object.keys(connectionsRef));
            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // if (database.connections > 2) {
            //     console.log("game is full");
            // }

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    connectionsRef.on("value", function (snap) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });



    var localUserObj = {
        player1: {
            name: player1Name,
            choice: "",
            wins: "",
            loses: "",
            player1Present: false
        },
        player2: {
            name: player2Name,
            choice: "",
            wins: "",
            loses: "",
            player2Present: false
        }
    }


    console.log(localUserObj.length);
        var player1Present = false;
        var player2Present = false;

        function checkNumberOfPlayers() {
            usersRef.on("value", function (snapshot) {
                player1Present = snapshot.val().player1.player1Present,
                    player2Present = snapshot.val().player2.player2Present

                if (player1Present && player2Present) {
                    $("#input").hide();
                    $("#addPlayer").hide();
                    console.log("player 1 " + player1Present);
                    console.log("player 2 " + player2Present);

                }
            });
        }

        checkNumberOfPlayers();

        $("#addPlayer").on("click", function () {
            //if player 1 is not present upadte player 1's name in the databse and replace it on the front end
            event.preventDefault();

            if (!player1Present && !player2Present) {
                player1Name = $("#input").val().trim();
                $("#player1-name").text(player1Name);
                database.ref("/users/player1").set({
                    name: $("#input").val().trim(),
                    player1Present: true,
                });
                usersRef.on("value", function (snapshot) {
                    player1Present = snapshot.val().player1.player1Present
                });
                database.ref("users/player1").onDisconnect().remove();

                //if player one is present, update player 2 in the database and in the front-end
            } else if (player1Present && !player2Present) {
                player2Name = $("#input").val().trim()
                $("#player2-name").text(player2Name);
                database.ref("/users/player2").set({
                    name: $("#input").val().trim(),
                    player2Present: true,
                });
                usersRef.on("value", function (snapshot) {
                    player2Present = snapshot.val().player2.player2Present
                });
                checkNumberOfPlayers();
                database.ref("users/player2").onDisconnect().remove();


            } else if (player1Present && player2Present) {
                alert("there are already two players here");
                checkNumberOfPlayers();
            }
        })

        usersRef.on("value", function (snapshot) {
            $("#player1-name").text(snapshot.val().player1.name);
            // console.log(snapshot.val().player1.name)
            $("#player2-name").text(snapshot.val().player2.name);


        })




        var connectedRef = firebase.database().ref(".info/connected");

        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                database.ref("/users/" + playerNumber).remove();
            } else {
                 alert("not connected");
            }
        });
});