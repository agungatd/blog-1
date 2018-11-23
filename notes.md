.env:
ENCRYPT_HASH = 10
MONGODB_URL_DEPLOY = mongodb://agung:agung123@ds261253.mlab.com:61253/my-blog
MONGODB_URL = mongodb://localhost:27017/MyBlog
JWT_SECRET = A17uA84lah$aY@
PORT = 3000
DOMAIN = http://localhost:8080
SENDGRID_API_KEY = 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
GOOGLE_APPLICATION_CREDENTIALS = ./keyfile.json

link deploy:
https://blogging-web.firebaseapp.com

kendala:
waktu, karena saya sakit hari minggu. server & TDD banyak berubah jadi TDD belum selesai.

fitur unik: belum selesai (text-to-speech content article. baru sampai buat file mp3 di server.)

## keyf
{
  "type": "service_account",
  "project_id": "my-blog-1ea8c",
  "private_key_id": "5261a615178fee5c69aa4e1c5e1d832f8d6cb562",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIcAytB7whJL3T\nZzk2ISOgSyEQuo+7WP8u6Y2RmKFWl4tF7TxWGH2oc0x6g45Up8/MOBI0TC4oDlwK\n+YScluvI3L2jmbNZxiXwPP5J4gak3X1e4WpU5RJ9OlXZzUo/ZisLbYKEFK+4jWXQ\nKgAVUXE6ztC6ZLJQOGbDubKG67YHkDTAsyY+QL9hRSCXqoxeHCFGhd7oM9bTLbnu\nb1VkSgTfilCrshMQ3/jMXqZQ2JbkFvcXf5jvrD/ZrabcLN4CnuNRI+ZdBYBmwBGv\nEA+GcmpVnQfaiPnT/HCoszkSZewPA6LfIRLS/WaqSvATHGvOm9D5DaFytQ2kuKhq\nGt565KFDAgMBAAECggEABVbld4yKXfBTyuMSj+xqaGA9UBaa3UOd1KWYcFr6XUtU\nhKHbvB1okjQJbbATJWfXrhnbnkoIkWeZ2xmnhzZcBJygw/rEX4KwSwniP5ybpF5Z\ncyLFHuAqpxcGkh1Duj73VurCvHsCmAN9mqyBFmWg2GS0WcAfTJTGuWBj2ZqY3Z2q\ngmFVnOE1pbGKaQerDC/z0dQuFUUGDePZAuBRKPSWss6VB19o81sqyMJ2CBM0cvV9\nSosk+GrflYKWd6Ca0ZgrUgZ3B63PTWfF46fC+pfPjNSlxBxo2DOsA6eYRG3hbdbM\n0fpsxzrktuprB5sMb5ANraDbJ7BIrsjQoratp71adQKBgQD9ZhHAN6UrzEzTZfz0\nRIUE5yywKYyjkwV20puEFkjkf3liX4KdiEUvksBo38QFdeKBmFw2N5tWOzwmS913\nFd4EUbYJ/XA//GUnhJVjOGUTAzPE3jjGq96yoOlUKQ7K1fpUCDa9JUW6+XQnM4LC\n7rPkpI8mN7awgx0n5gvSYmsmTwKBgQDKfsyCnNYzuKwiSwKOws6P7ahUVuryZtva\n/VP+3kGyURF32QNAC9NXkcIyOAd3FeQQ/4CFadv6KCg8qif9V8xxe133oFiF6ctQ\n5Oc8iqSls7LoNIWhXGObR2mEhR5BmM3fgLtAcVPejVu92RBBuaLGISR0dEm0Py3a\n9f80mnDMzQKBgHG3s7Gih0Jvje60718jvNplcH2iN9ZUrXgUrewKIC5DMtM9750I\nwZvG7Qhjm1GkBMGKAZ/nNpPtQ2IgW8QMkTU5Akvba9ubRj4E1xHPBjURE9N+stYd\n3XQmmG/HeTb37j517TLXHkL5nfHVwRIAE8VBQGizSg5O2O/F4npI5rMrAoGBAKuj\nOrnjMnT4rX8L0YksemXo7es/GTqKEQTYAWBhB5KbwJCzc1vQKj1poQ9sCnfYKE54\nI3nyNrEdZK23FNpal0IBba69TQuFFf7lZ1MbuV9yp8zG6BXT9+HgcAIRy4mSeb5e\noVmINazIaODMokjzjpMd+IZ1IxwTCU01gjIWTlJpAoGBAJKa6yviManTTANz4hgM\n6hNVorE+PvSXzQyOTLZ62wBgrGOkZ+IKpeR1zLF/6Z4736UceDoGbo2snNwllA/3\nPUv2CSB4y913jFpnooaYfnfRUjYdJdOas7E8iN93xHK7rOCurQgtQY6gIXvYplbS\n3caYg2QjBK5fU+JoJ367mddS\n-----END PRIVATE KEY-----\n",
  "client_email": "my-blog-1ea8c@appspot.gserviceaccount.com",
  "client_id": "115289717676658329213",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/my-blog-1ea8c%40appspot.gserviceaccount.com"
}

## client: .src/assets/config.js
var config = {
  apiKey: "AIzaSyAEup1N4TaLrPH-6iAYIeFOyVzqDMZg4mk",
  authDomain: "blogging-web.firebaseapp.com",
  databaseURL: "https://blogging-web.firebaseio.com",
  projectId: "blogging-web",
  storageBucket: "blogging-web.appspot.com",
  messagingSenderId: "293231621616"
};
firebase.initializeApp(config);

export default firebase

## Client google API key.js (in .src/assets/api_key.js)
module.exports = 'AIzaSyAEup1N4TaLrPH-6iAYIeFOyVzqDMZg4mk'