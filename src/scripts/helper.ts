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

export function getRequiredField(data: FormData, name: string): string {
    const value = data.get(name);
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Missing field: ${name}`);
    }
    return value;
}

export function onFormSubmit(
    formId: string,
    handler: (data: FormData) => void
) {
    const form = document.getElementById(formId) as HTMLFormElement;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handler(new FormData(form));
    });
}