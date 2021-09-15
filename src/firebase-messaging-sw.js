// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here, other Firebase libraries
// // are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');


// import { environment as prodEnvironment } from "./environment.prod";

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object

// // firebase.initializeApp(prodEnvironment.firebaseConfig);


// firebase.initializeApp({
//     apiKey: "AIzaSyDn-2hHXaDksL0W-0vL5BUK05NB44qqNxY",
//     authDomain: "the-awrad-app.firebaseapp.com",
//     projectId: "the-awrad-app",
//     storageBucket: "the-awrad-app.appspot.com",
//     messagingSenderId: "259382085345",
//     appId: "1:259382085345:web:030a7e5d84373b4baa59a0",
//     measurementId: "G-SK72SFZYQN"
// });


// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();


importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');



firebase.initializeApp({
    // REPLACE BY YOUR FIREBASE CONFIG HERE
    apiKey: "AIzaSyDn-2hHXaDksL0W-0vL5BUK05NB44qqNxY",
    authDomain: "the-awrad-app.firebaseapp.com",
    projectId: "the-awrad-app",
    storageBucket: "the-awrad-app.appspot.com",
    messagingSenderId: "259382085345",
    appId: "1:259382085345:web:030a7e5d84373b4baa59a0",
    measurementId: "G-SK72SFZYQN"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


// // import { initializeApp } from "firebase/app";
// // import { getMessaging } from "firebase/messaging/sw";

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// const firebaseApp = initializeApp({
//     apiKey: "AIzaSyDn-2hHXaDksL0W-0vL5BUK05NB44qqNxY",
//     authDomain: "the-awrad-app.firebaseapp.com",
//     projectId: "the-awrad-app",
//     storageBucket: "the-awrad-app.appspot.com",
//     messagingSenderId: "259382085345",
//     appId: "1:259382085345:web:030a7e5d84373b4baa59a0",
//     measurementId: "G-SK72SFZYQN"
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = getMessaging(firebaseApp);

