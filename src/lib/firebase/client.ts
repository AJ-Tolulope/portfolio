"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseClientConfigured = () =>
  Object.values(clientConfig).every((value) => Boolean(value));

export const getFirebaseClient = () => {
  if (!isFirebaseClientConfigured()) {
    throw new Error("Firebase client configuration is not complete.");
  }
  return getApps().length ? getApp() : initializeApp(clientConfig);
};

export const getFirebaseAuth = () => getAuth(getFirebaseClient());
export const getFirebaseStorage = () => getStorage(getFirebaseClient());
