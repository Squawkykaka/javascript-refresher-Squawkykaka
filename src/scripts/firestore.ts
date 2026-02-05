import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence, signInAnonymously, type Auth, type User } from "firebase/auth";
import { addDoc, collection, doc, getFirestore, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { showError } from "./helper";
import { messageConverter, userConverter } from "./models";

const firebaseConfig = {

    apiKey: "AIzaSyCIis9Z4Un_DjSRSXTUMJsz44IRTQx_j5Y",

    authDomain: "javascript-refresher-23281gl.firebaseapp.com",

    projectId: "javascript-refresher-23281gl",

    storageBucket: "javascript-refresher-23281gl.firebasestorage.app",

    messagingSenderId: "347248934000",

    appId: "1:347248934000:web:7348e36e518c571058c8b5"

};

// *************
// General initialisation code.

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

export async function initAuth() {
    await setPersistence(auth, browserSessionPersistence);
}

// *************
// Helper functions to signin, get current user etc.

export async function signInAnon() {
    try {
        await signInAnonymously(auth);
    } catch (err) {
        showError(err);
    }
}

export function getUser(): User {
    let user = auth.currentUser;
    if (user) {
        return user;
    } else {
        throw new Error("User is not currently logged in.");
    }
}

export async function sendMessage(message: string) {
    let user = getUser();

    addDoc(messagesCol, {
        text: message,
        createdAt: serverTimestamp(),
        userRef: doc(db, "users", user.uid),
        userName: user.displayName || "Anonymous"
    });

    updateDoc(doc(usersCol, user.uid), {
        // filtering by messages sent seems like a relatively decent sorting mechanism for default
        messagesSent: increment(1),
    });
}

// *************
// Premade collections to stop errors.

export const messagesCol = collection(db, "messages")
    .withConverter(messageConverter);

export const usersCol = collection(db, "users")
    .withConverter(userConverter);