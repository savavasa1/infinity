const admin = require("firebase-admin"); // Import the Firebase Admin SDK
require("dotenv").config();

const serviceFromEnv = JSON.parse(process.env.FIREBASE_AUTH);

admin.initializeApp({
  credential: admin.credential.cert(serviceFromEnv),
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

async function checkPromoCode(code, collectionName = "promo-codes") {
  const docRef = await db.collection(collectionName).get();

  const data = docRef.docs.map((doc) => doc.data());

  const snapshot = data.find((present) => present.code_name === code);

  if (typeof snapshot === "undefined") {
    return { message: "You have entered an invalid code!" };
  }

  if (snapshot.is_used) {
    return { message: "This promo code has already been used!" };
  }

  return snapshot;
}

async function checkDuplicatePromoCode(code, collectionName = "promo-codes") {
  const docRef = await db.collection(collectionName).get();

  const data = docRef.docs.map((doc) => doc.data());

  const snapshot = data.find((present) => present.code_name === code);

  if (!snapshot) {
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

async function applyPromoCode(data, collectionName = "promo-codes") {
  const docRef = await db.collection(collectionName).get();

  const res = docRef.docs.map((doc) => doc.data());

  const user = res.find((present) => present.code_name === data);

  const updatedUser = await db
    .collection(collectionName)
    .doc(user.user_email)
    .set({ ...user, is_used: true });

  return { ...user, is_used: true };
}

module.exports = {
  isEmailSubscribed,
  addToNewsletter,
  checkPromoCode,
  checkDuplicatePromoCode,
  applyPromoCode,
};
