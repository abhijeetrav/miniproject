// lib/firebaseAdmin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  // private key in env must have newline characters unescaped
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey!,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  });
}

export const dbAdmin = admin.database();
