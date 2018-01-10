const functions = require('firebase-functions');


const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.addMessage = functions.https.onRequest((req, res) => {
	// Grab the text parameter.
	const original = req.body;
	console.log(req.body)
	admin.database().ref('/messages').on("value", data => {
		console.log('here it is buddy:', data.val())
	})

	// Push the new message into the Realtime Database using the Firebase Admin SDK.
	admin.database().ref('/messages').push(original).then(snapshot => {
	// Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
	// res.redirect(303, snapshot.ref);
	console.log('reponded')
	res.status(200).send({"success":"1"});

  });
});

// exports.countDevices = functions.database.ref('/users')
//     .onWrite(event => {
//       // Grab the current value of what was written to the Realtime Database.
//       const data = event.data.val();
//       const mobileCount = Object.keys(data).filter(x=>data[x].device =='mobile').length
//       const desktopCount = Object.keys(data).filter(x=>data[x].device =='desktop').length
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to the Firebase Realtime Database.
//       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//       return event.data.ref.parent.child('deviceCounts').set({mobile: mobileCount, desktop: desktopCount});
//     });