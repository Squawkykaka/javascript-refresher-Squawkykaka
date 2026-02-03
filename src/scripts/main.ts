import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyCIis9Z4Un_DjSRSXTUMJsz44IRTQx_j5Y",

    authDomain: "javascript-refresher-23281gl.firebaseapp.com",

    projectId: "javascript-refresher-23281gl",

    storageBucket: "javascript-refresher-23281gl.firebasestorage.app",

    messagingSenderId: "347248934000",

    appId: "1:347248934000:web:7348e36e518c571058c8b5"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




let message = document.getElementById("welcomeMessage")!;
message.innerHTML = "Javascript Loaded";

console.log("Test");

document.getElementById("headingButton")!.addEventListener("click", event => {
    message.innerHTML = "You pressed the button!";
});

// changing header with a form
let form: HTMLFormElement = document.getElementById("headingForm")!;
form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const newName = data.get("newHeadingName");

    message.innerHTML = newName;
    updateMessage(newName);
});

async function updateMessage(text: string) {
    await setDoc(doc(db, "main", "note"), {
        content: text
    });
}