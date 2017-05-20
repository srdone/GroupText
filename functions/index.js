const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendMessage = functions.database.ref('/messages/{pushId}').onWrite(event => {
  const message = event.data.val();
  console.log(message);
  return Promise.all(
    message.recipients.map(r => admin.database().ref('/recipients/' + r.key).once('value').then(s => s.val()))
  ).then(function (recipients) {
    console.log(recipients);
    const updatedMsgRecipients = message.recipients.map(r => Object.assign(r, {isSent: true}));
    return Promise.all([
      event.data.ref.child('isSent').set(true),
      event.data.ref.child('recipients').set(updatedMsgRecipients)
    ]);
  })
});
