'use strict';

// Import the Dialogflow module and response creation dependencies from the 
// Actions on Google client library.
const {dialogflow,
Permission,
Suggestions,
BasicCard} = require('actions-on-google');
var twilio = require('twilio');
var accountSid = ''; // Your Account SID from www.twilio.com/console
var authToken = '';   // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

var parameters;
var room;
var subject;

// const moment = require('moment');
// let m = moment();      

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

app.intent('BookRoom - yes', (conv) => {
    conv.close(`Sure, no problem! I'll call the reception from our phone.`);

    client.studio.flows('FW31ea58715cf6d41658797b312b39229d ').executions.create({ to: '+32492183572', from: '+3242681801', parameters: JSON.stringify({name: "Gerry"})}).then(function(execution) { console.log(execution.sid); });

});

app.intent('BookRoom', (conv, params) => {
  var d = new Date();

  parameters  = params;

  var dateMonth = (new Date(parameters.date)).getMonth() + 1 ;

  // if(params.date > d.getDate() + 14){
  if(dateMonth == 12){  
    conv.ask('Ok, this is too far in the future. Do you want me to call reception on your phone to set something up in person?');
    
  }
  else {
    conv.ask('I found 2 possibilities. One is the executive suite on the penthouse, or you have the one in the basement. Which one do you want?');
  }

});


app.intent('BookRoom - Room', (conv, params) => {

    room = params.MeetingRoom;
    
    conv.ask(`OK, I can book ${room}. `);
    conv.ask(`What's the subject of the meeting?`);

});

app.intent('BookRoom - Room - Subject', (conv, params) => {
  var time = (new Date(parameters.time)).getHours() + 2;
  var dateMonth = (new Date(parameters.date)).getMonth() + 1 ;
  var dateDay = (new Date(parameters.date)).getDate();


  subject = params.subject;
  conv.ask(`OK, I've booked ${room} from  ${time} on  ${dateDay} ${dateMonth}  for ${parameters.number} people with subject ${subject}. `);
  conv.ask(`Did I get everthing right?`);

});


app.intent('GetSchedule - detailsyes', (conv, params) => {
  var time = (new Date(parameters.time)).getHours() + 2;
  var dateMonth = (new Date(parameters.date)).getMonth() + 1 ;
  var dateDay = (new Date(parameters.date)).getDate();

  conv.close(`OK, your meeting is in ${room} from  ${time} on  ${dateDay} ${dateMonth} with ${parameters.number} people. The meeting will be about ${subject}. `);


});




// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
