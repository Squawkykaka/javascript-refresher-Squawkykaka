import { sendMessage } from "./firestore";

function sendEmbed(link:string) {
    sendMessage(link, "embed")
}

function sendPicture(link:string) {
    sendMessage(link, "picture")
}

function renderPicture(link:string) {
    
}