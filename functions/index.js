const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendMessage = functions.database.ref('/messages/{pushId}/message').onWrite(event => {
  const original = event.data.val();
  console.log('Setting to sent', event.params.pushId, original);
  return event.data.ref.parent.child('isSent').set(true);
});
