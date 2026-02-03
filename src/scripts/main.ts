import { initializeApp } from "firebase/app";
import { EmailAuthProvider, getAuth, linkWithCredential, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyCIis9Z4Un_DjSRSXTUMJsz44IRTQx_j5Y",

    authDomain: "javascript-refresher-23281gl.firebaseapp.com",

    projectId: "javascript-refresher-23281gl",

    storageBucket: "javascript-refresher-23281gl.firebasestorage.app",

    messagingSenderId: "347248934000",

    appId: "1:347248934000:web:7348e36e518c571058c8b5"

};

let message = document.getElementById("welcomeMessage")!;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
signInAnonymously(auth).then(() => {
    let user = auth.currentUser!;
    setDoc(doc(db, "users", user.uid), {
        messagesSent: 0,
    })
}).catch(error => {
    message.innerHTML = error
})

let userName = "Anonymous";

// changing header with a form
let headerForm: HTMLFormElement = document.getElementById("headingForm")!;
headerForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(headerForm);
    const newName = data.get("newHeadingName");
    updateMessage(newName);
});

/// function to update the header with a new name
async function updateMessage(text: string) {
    // this function is always called in a context where we know it is valid

    let user = auth.currentUser;
    addDoc(collection(db, "header"), {
        title: text,
        createdAt: serverTimestamp(),
        userRef: doc(db, "users", user.uid),
        userName: user.email
    })
    updateDoc(doc(db, "users", user.uid), {
        // filtering by messages sent seems like a relatively decent sorting mechanism for default
        messagesSent: increment(1)
    })

}

// when a change to the database is detected, pulls it and applies it to the header and update list.
const unsubscribeHeader = onSnapshot(query(collection(db, "header"), orderBy("createdAt", "desc"), limit(5)), (snapshot) => {
    if (!snapshot.empty) {
        // apply to header
        const doc = snapshot.docs[0];
        const data = doc.data();

        let new_title = data.title;
        message.innerText = new_title;

        console.debug("New Title: ", new_title);

        // apply to list
        for (let i = 0; i < snapshot.docs.length; i++) {
            const element = snapshot.docs[i];
            const data = element.data();

            let htmlElement = document.querySelector(`#changeList > #item${i + 1}`)!;

            let createdDate: Timestamp;
            if (data.createdAt) {createdDate = data.createdAt} else {createdDate = Timestamp.now()};
            let date = createdDate.toDate();
            let formattedDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

            let userName = "";
            if (data.userName) { userName = data.userName } else { userName = "Anonymous" };
            htmlElement.innerText = `
            <p>${data.title}</p>
            <p>${formattedDate}</p>
            <p>${userName}</p>`;
        }
    }
})

// Signup
let signupForm: HTMLFormElement = document.getElementById("signupForm")!;
signupForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const email = data.get("email");
    const password = data.get("password");

    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(auth.currentUser!, credential)
        .then((usercred) => {
            const user = usercred.user;
            document.querySelector("#signupForm > p")!.innerHTML = "Success";

            setDoc(doc(db, "users", user.uid), {
                displayName: user.displayName,
                email: user.email,
                messagesSent: 0,
            })
        }).catch((error) => {
            console.error("Error upgrading anonymous account", error);
            document.querySelector("#signupForm > p")!.innerHTML = error;
        });
});

// Login
let loginForm: HTMLFormElement = document.getElementById("loginForm")!;
loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const email = data.get("email");
    const password = data.get("password");

    signInWithEmailAndPassword(auth, email, password).then(() => {
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
        const uid = user.uid;

        if (user.email) { userName = user.email };
        document.getElementById("userName")!.innerHTML = userName;

        console.log("Enabling form");
        document.querySelector("#headingButton")!.removeAttribute("disabled");
        // ...
    } else {
        // User is signed out
        // ...
    }
});