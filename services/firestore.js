const admin = require("firebase-admin"); // Import the Firebase Admin SDK
require("dotenv").config();

const firebaseCredentials = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert({
    ...firebaseCredentials,
    private_key: private_key.replace("\n", /\\n/g),
  }),
});

const db = admin.firestore(); // This is how you get the Firestore instance with Admin SDK
async function isEmailSubscribed(collectionName = "promo-codes", email) {
  const docRef = await db.collection(collectionName).get();

  const data = docRef.docs.map((doc) => doc.data());

  const snapshot = data.find((present) => present.user_email === email);

  if (typeof snapshot === "undefined") {
    return false;
  }
  return true;
}

async function addToNewsletter(collectionName = "promo-codes", data) {
  const docRef = await db
    .collection(collectionName)
    .doc(data.user_email)
    .set(data);
  return docRef;
}

module.exports = { isEmailSubscribed, addToNewsletter };
