import { EmailAuthProvider, linkWithCredential, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, limit, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { auth, getUser, initAuth, messagesCol, sendMessage, signInAnon, usersCol } from "./firestore";
import { formatTime, getRequiredField, makeP, onFormSubmit } from "./helper";

(function init() {
    initAuth();
})();

onFormSubmit("headingForm", (data) => {
    const message = String(data.get("message"))
    sendMessage(message);
})

// when a change to the database is detected, pulls it and applies it to the header and update list.
onSnapshot(
    query(messagesCol, orderBy("createdAt", "desc"), limit(5)),
    (snapshot) => {
        if (snapshot.empty) return;

        snapshot.docs.forEach((docSnap, index) => {
            const data = docSnap.data();
            let container = document.querySelector(`#changeList > #item${index + 1}`) as Element;

            if (!container) return;

            container.replaceChildren(
                makeP(data.text),
                makeP(formatTime(data.createdAt)),
                makeP(data.userName)
            )
        })
    }
);

onFormSubmit("signupForm", async (data) => {
    const email = getRequiredField(data, "email");
    const password = getRequiredField(data, "password");
    const displayName = getRequiredField(data, "displayName");
    let user = getUser();

    updateProfile(user, {
        displayName: displayName,
    });

    const credential = EmailAuthProvider.credential(email, password);

    try {
        user = (await linkWithCredential(user, credential)).user;
        setDoc(doc(usersCol, user.uid), {
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