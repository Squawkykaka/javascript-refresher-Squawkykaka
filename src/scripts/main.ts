import { EmailAuthProvider, linkWithCredential, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, limit, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { auth, getUser, initAuth, messagesCol, sendMessage, signInAnon, usersCol } from "./firestore";
import { formatTime, getRequiredField, makeP, onFormSubmit } from "./helper";

(function init() {
    initAuth();
})();

onFormSubmit("headingForm", (data) => {
    const message = String(data.get("message"));
    sendMessage(message);
});

// when a change to the database is detected, pulls it and applies it to the header and update list.
onSnapshot(
    query(messagesCol, orderBy("createdAt", "desc"), limit(5)),
    (snapshot) => {
        if (snapshot.empty) return;

        let container = document.querySelector("#changeList") as Element;
        if (!container) return;
        const user = getUser();

        snapshot.docChanges().forEach(docSnap => {
            const data = docSnap.doc.data();
            const messageId = docSnap.doc.id;

            const existing = container.querySelector(
                `li[data-message-id="${messageId}"]`
            );

            let newChild = document.createElement("li");
            newChild.dataset.messageId = messageId;

            newChild.replaceChildren(
                makeP(data.text),
                makeP(formatTime(data.createdAt)),
                makeP(data.userName)
            );


            if (data.userRef.id == user.uid) {
                newChild.classList.add("personalMessage");
            }

            // add the message id, so we dont duplicate messges twice
            if (existing) {
                existing.replaceWith(newChild);
            } else {
                container.appendChild(newChild);
            }
        });

        container.scrollTop = container.scrollHeight;
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

});

// This enables the message send button
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById("userName")!.innerText = user.displayName || (user.email || "Anonymous");

        document.querySelector("#headingButton")!.removeAttribute("disabled");
    } else {
        await signInAnon();
    }
});