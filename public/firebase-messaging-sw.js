importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCZY5efDDehWlVFT-56orZau5KNx0MJ5Qk",
  authDomain: "pookie-95ae2.firebaseapp.com",
  projectId: "pookie-95ae2",
  storageBucket: "pookie-95ae2.firebasestorage.app",
  messagingSenderId: "705366904569",
  appId: "1:705366904569:web:ca8004ac4e462858059c28",
  measurementId: "G-XWS3GR0SKL"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
