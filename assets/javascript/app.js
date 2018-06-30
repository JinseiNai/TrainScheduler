// Initialize Firebase
var config = {
    apiKey: "AIzaSyDlV-x2w4ee4j7uRCtJ6hDCiV77V6rQbfQ",
    authDomain: "train-scheduler-6ceda.firebaseapp.com",
    databaseURL: "https://train-scheduler-6ceda.firebaseio.com",
    projectId: "train-scheduler-6ceda",
    storageBucket: "train-scheduler-6ceda.appspot.com",
    messagingSenderId: "210316422851"
};
firebase.initializeApp(config);

//   Set variables
let database = firebase.database();
let trainName;
let destination;
let trainTime;
let frequency;
let now = moment();

//   On submit button click
$('#submitBtn').on('click', function () {
    event.preventDefault();

    trainName = $('#enterTrain').val().trim();
    destination = $('#enterDestination').val().trim();
    trainTime = $('#enterFirstTime').val().trim();
    frequency = $('#enterFrequency').val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTime: trainTime,
        frequency: frequency,
    })
})



//   On load get data from firebase
database.ref().on("child_added", function (snapshot) {
    //   Log data
    let logTrain = (snapshot.val().trainName);
    let logDestination = (snapshot.val().destination);
    let logTrainTime = moment(snapshot.val().firstTime, 'HH:mm');
    let logFrequency = (snapshot.val().frequency);
    
    // console.log(`Current Time: ${now}`);
    // console.log(`Train Time: ${logTrainTime}`);
    // console.log(logFrequency);

    // Check if train time is behind (less) than current time
    while (logTrainTime < now) {
        // Keep adding frequency time to train time till its over current time
        logTrainTime = moment(logTrainTime).add(snapshot.val().frequency, 'minutes');
    }
    // console.log(moment(logTrainTime).format('HH:mm'));

    // Create a tr div
    let trDiv = $('<tr>');
    
    // Append variables to the trDiv
    trDiv.append(`
    <td>${logTrain}</td>
    <td>${logDestination}</td>
    <td>${logFrequency}</td>
    <td>${moment(logTrainTime).format('HH:mm')}</td>
    <td>${logTrainTime.diff(now, 'minutes')}</td>
    `);

    // Append tr div to table
    $('.train-info').append(trDiv);
})

