import { initializeApp } from "firebase/app";
import { browserSessionPersistence, EmailAuthProvider, getAuth, linkWithCredential, onAuthStateChanged, setPersistence, signInAnonymously, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { auth, db, getUser, sendMessage, signInAnon } from "./firestore";

(function init() {
    signInAnon();
})();

// changing header with a form
let headerForm = document.getElementById("headingForm") as HTMLFormElement;
headerForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(headerForm);

    const message = String(data.get("message") || "");
    sendMessage(message);
});


// when a change to the database is detected, pulls it and applies it to the header and update list.
const unsubscribeHeader = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5)), (snapshot) => {
    if (!snapshot.empty) {
        for (let i = 0; i < snapshot.docs.length; i++) {
            const element = snapshot.docs[i];
            const data = element.data();

            let htmlElement = document.querySelector(`#changeList > #item${i + 1}`) as Element;

            let createdDate: Timestamp;
            if (data.createdAt) { createdDate = data.createdAt; } else { createdDate = Timestamp.now(); };
            let date = createdDate.toDate().toLocaleTimeString();

            let userName = "";
            if (data.userName) { userName = data.userName; } else { userName = "Anonymous"; };

            htmlElement.replaceChildren(
                makeP(data.text),
                makeP(date),
                makeP(userName)
            );

            function makeP(text: string) {
                const p = document.createElement("p");
                p.textContent = text; // escapes automatically
                return p;
            }
        }
    }
});

// Signup
let signupForm = document.getElementById("signupForm") as HTMLFormElement;
signupForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const displayName = data.get("displayName") as string;
    const user = getUser();

    updateProfile(user, {
        displayName: displayName,
    });

    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(user, credential)
        .then((usercred) => {
            const user = usercred.user;
            document.querySelector("#signupForm > p")!.innerHTML = "Success";

            setDoc(doc(db, "users", user.uid), {
                displayName: user.displayName,
                email: user.email,
                messagesSent: 0,
            });
        }).catch((error) => {
            console.error("Error upgrading anonymous account", error);
            document.querySelector("#signupForm > p")!.innerHTML = error;
        });
});

// Login
let loginForm = document.getElementById("loginForm") as HTMLFormElement;
loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const email = data.get("email");
    const password = data.get("password");

    console.log(email, password);

    signInWithEmailAndPassword(auth, String(email), String(password)).then(() => {
        document.querySelector("#loginForm > p")!.innerHTML = "Success";

    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, ": ", errorMessage);
        document.querySelector("#loginForm > p")!.innerHTML = errorMessage;
    });;
});

// This enables the heading update button, and sets the userName variable for easy access
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        let user = getUser();
        document.getElementById("userName")!.innerText = user.displayName || (user.email || "Anonymous");

        document.querySelector("#headingButton")!.removeAttribute("disabled");
        // ...
    } else {
        // User is signed out
        // ...
    }
});