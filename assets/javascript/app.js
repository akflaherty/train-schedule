$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCUJMT4zvb_YcLO42F26SRj4wKxhWnIdOU",
        authDomain: "train-schedule-a46e0.firebaseapp.com",
        databaseURL: "https://train-schedule-a46e0.firebaseio.com",
        projectId: "train-schedule-a46e0",
        storageBucket: "train-schedule-a46e0.appspot.com",
        messagingSenderId: "362637515922"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database
    var database = firebase.database();

    // Get inputs
    $('#submit').on('click', function(event) {
        // get name
        var name = $('#inputName').val();

        // get destination
        var destination = $('#inputDestination').val();

        // get time of first train
        var startTime = $('#inputStartTime').val();

        // get frequency
        var frequency = $('#inputFrequency').val();

        // push to Firebase
        database.ref().push({
            name: name,
            destination: destination,
            start: startTime,
            frequency: frequency
        })
    })

    // when data is updated in Firebase, update the table
    database.ref().on('child_added', function(childSnapshot) {
        var $table = $('#train-table');
        var $newRow = $('<tr></tr>');
        // name
        var trainName = childSnapshot.val().name;
        var $nameCell = $('<td></td>').text(trainName);
        $newRow.append($nameCell);

        // destination
        var trainDestination = childSnapshot.val().destination;
        var $destinationCell = $('<td></td>').text(trainDestination);
        $newRow.append($destinationCell);

        // frequency
        var trainFreq = childSnapshot.val().frequency;
        var $freqCell = $('<td></td>').text(trainFreq);
        $newRow.append($freqCell);

        // next arrival
        var trainStart = childSnapshot.val().start;
        var trainNext = findNext(trainStart, trainFreq);
        var $nextCell = $('<td></td>').text(moment(trainNext).format("hh:mm"));
        $newRow.append($nextCell);

        // wait time 
        var trainWait = trainNext.diff(moment(), 'minutes');
        var $waitCell = $('<td></td>').text(trainWait);
        $newRow.append($waitCell);

        $table.append($newRow);
    })

    function findNext(start, freq) {
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        var startTimeConverted = moment(start, "hh:mm").subtract(1, "years");
        // console.log(startTimeConverted);

        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % freq;

        // Minute Until Train
        var tMinutesTillTrain = freq - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        return nextTrain;
    }
})