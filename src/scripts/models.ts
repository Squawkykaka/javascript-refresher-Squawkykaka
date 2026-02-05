import { DocumentReference, Timestamp, type DocumentData, type FirestoreDataConverter, type QueryDocumentSnapshot, type SnapshotOptions } from "firebase/firestore"

export type Message = {
    text: string,
    createdAt: Timestamp,
    userName: string
    userRef: DocumentReference<DocumentData, DocumentData>
}

export type UserProfile = {
    displayName: string | null;
    email: string | null;
    messagesSent: number;
}

// **************
// Firestore converters, automatically converts to nice typescript types
// so i dont have to hope that i type right.

export const messageConverter: FirestoreDataConverter<Message> = {
    toFirestore(message) {
        return message;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Message {
        const data = snapshot.data(options);

        return {
            text: data.text,
            createdAt: data.createdAt ?? Timestamp.now(),
            userName: data.userName ?? "Anonymous",
            userRef: data.userRef,
        };
    }
};

export const userConverter: FirestoreDataConverter<UserProfile> = {
    toFirestore(user) {
        return user;
    },
    fromFirestore(snapshot, options): UserProfile {
        const data = snapshot.data(options);

        return {
            displayName: data.displayName ?? null,
            email: data.email ?? null,
            messagesSent: data.messagesSent ?? 0,
        };
    }
};