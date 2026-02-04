import { Timestamp } from "firebase/firestore";

export function showError(err: any) {
    console.error("Error: ", err);
}

export function makeP(text: string) {
    const p = document.createElement("p");
    p.textContent = text; // escapes automatically
    return p;
}

export function formatTime(ts?: Timestamp) {
    const date = (ts ?? Timestamp.now()).toDate();
    return date.toLocaleTimeString();
}
