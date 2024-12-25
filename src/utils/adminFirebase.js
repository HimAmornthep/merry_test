import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const adminSdk = admin;
