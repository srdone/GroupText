const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Bandwidth = require('node-bandwidth');

const config = functions.config();

const client = new Bandwidth({
  userId: config.bandwidth_sms.user_id,
  apiToken: config.bandwidth_sms.api_token,
  apiSecret: config.bandwidth_sms.api_secret
});

admin.initializeApp(functions.config().firebase);

exports.sendMessage = functions.database.ref('/messages/{pushId}').onWrite(event => {
  const message = event.data.val();
  console.log(message);
  getRecipients(message.recipients)
    .then(recipients => sendMessage(message, recipients))
    .then(responses => recordResponses(message, responses, event));
});

function getRecipients(recipients) {
  return Promise.all(
    recipients.map(r => admin.database().ref('/recipients/' + r.key).once('value').then(s => s.val()))
  )
}

function sendMessage(message, recipients) {
  console.log(recipients);
  return Promise.all(recipients.map(r => client.Message.send({
    from: config.bandwidth_sms.phone_number,
    to: r.phoneNumber,
    text: message.message
  })))
  .catch(err => ({isError: true, err}))
}

function recordResponses(message, responses, event) {
  console.log(responses);
  const updatedMsgRecipients = message.recipients.map(r => Object.assign(r, {isSent: true}));
  return Promise.all([
    event.data.ref.child('isSent').set(true),
    event.data.ref.child('recipients').set(updatedMsgRecipients)
  ]);
}
