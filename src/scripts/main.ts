import { EmailAuthProvider, linkWithCredential, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, limit, onSnapshot, orderBy, query, setDoc, Timestamp } from "firebase/firestore";
import { auth, db, getUser, initAuth, sendMessage, signInAnon } from "./firestore";
import { formatTime, makeP } from "./helper";

(function init() {
    initAuth();
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
onSnapshot(
    query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5)),
    (snapshot) => {
        if (snapshot.empty) return;

        snapshot.docs.forEach((docSnap, index) => {
            const data = docSnap.data();
            let container = document.querySelector(`#changeList > #item${index + 1}`) as Element;

            if (!container) return;

            container.replaceChildren(
                makeP(data.text),
                makeP(formatTime(data.createdAt)),
                makeP(data.userName ?? "Anonymous")
            )
        })
    }
);

function onFormSubmit(
    formId: string,
    handler: (data: FormData) => void
) {
    const form = document.getElementById(formId) as HTMLFormElement;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handler(new FormData(form));
    });
}

onFormSubmit("signupForm", async (data) => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const displayName = data.get("displayName") as string;
    let user = getUser();

    updateProfile(user, {
        displayName: displayName,
    });

    const credential = EmailAuthProvider.credential(email, password);

    try {
        user = (await linkWithCredential(user, credential)).user;
        setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName,
            email: user.email,
            messagesSent: 0,
        });
    } catch (error) {
        console.error("Error upgrading anonymous account", error);
        document.querySelector("#signupForm > p")!.innerHTML = error;
    }

});

// Login

onFormSubmit("loginForm", async (data) => {
    try {
        await signInWithEmailAndPassword(
            auth,
            String(data.get("email")),
            String(data.get("password"))
        );
    } catch (error) {
        console.log(error.code, ": ", error.message);
        document.querySelector("#loginForm > p")!.innerHTML = error.message;
    }

})

// This enables the message send button
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById("userName")!.innerText = user.displayName || (user.email || "Anonymous");

        document.querySelector("#headingButton")!.removeAttribute("disabled");
    } else {
        await signInAnon();
    }
});