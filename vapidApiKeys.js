const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

const { publicKey, privateKey } = vapidKeys
console.log(publicKey)
console.log(privateKey)