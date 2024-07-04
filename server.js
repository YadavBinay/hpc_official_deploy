require('dotenv').config();

const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const webpush = require("web-push")
const admin = require("firebase-admin")
const { connectMongoDb } = require('./Connection/mongoDbConnection.js');

const app = express();
const PORT = process.env.PORT || 4000;

// Connection
connectMongoDb(process.env.MONGO_CONNECTION_URL).then(() =>
  console.log('Mongodb connected')
);

// Ensure Message model is registered
require('./models/messageModel.js');
const publicKey = "BFgjsYs_KEcOmze9LfwASkUsAmKC7o_eJLvcsVfEkpUV77u3OMEnODDUftSKENX4jj3acAIQwPlp7ba2d_0I5U8"
const privateKey = "Wej2WIjG3hT0lGUXYHyiqpKfKSy7kistOz_PlTN_dgQ"
webpush.setVapidDetails('mailto:test@gmail.com', publicKey, privateKey)
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mern-auth-e47b7-default-rtdb.firebaseio.com/' // Replace with your Firebase database URL
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// Serve user-uploaded images from the 'uploads/images/users' directory
app.use(express.static(path.join('uploads', 'images', 'users')));


app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  const msg = `${req.method} \ ${req.url} ${req.hostname} ${Date.now()}\n`;
  fs.appendFile('log.txt', msg, () => {
    console.log(msg);
  });
  next();
});

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get("/subscribe", (req, res) => {
  try {
    const subscription = req.body
    const payload = JSON.stringify({ "title": 'Push Text' })
    webpush.sendNotification(subscription, payload).catch(err => console.error(err))
  }
  catch (error) {
    res.status(500).json("Error")
  }
})
app.post('/send-notification', (req, res) => {
  const { userId, notificationType, title, body } = req.body;

  if (notificationType === 'web-push') {
    admin.firestore().collection('subscriptions').doc(userId).get()
      .then(doc => {
        if (doc.exists) {
          const subscription = doc.data().subscription;
          const payload = JSON.stringify({ title: title, body: body });

          webpush.sendNotification(subscription, payload)
            .then(() => {
              console.log('Web push notification sent successfully');
              res.status(200).send('Notification sent successfully');
            })
            .catch(error => {
              console.error('Error sending web push notification:', error);
              res.status(500).send('Error sending notification');
            });
        } else {
          console.error('Subscription not found for user:', userId);
          res.status(404).send('Subscription not found');
        }
      })
      .catch(error => {
        console.error('Error fetching subscription:', error);
        res.status(500).send('Error fetching subscription');
      });
  }
  // Add other notification types (e.g., FCM for mobile) as needed

});


// Import and use routes
const configureRoutes = require('./routesConfig.js');
configureRoutes(app);

// Start server
const server = app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// Initialize Socket.io
const {initializeSocket} = require('./Connection/initSocket.js');
const io = initializeSocket(server);

module.exports = { io };
