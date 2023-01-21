import {FireStore_Collections, IFirebase} from "../firebase.service";
import * as firestore from "firebase/firestore"
import firebase from "firebase/compat/app";
import {INotes, IUser} from "../user.service";

export interface IFirebasePlayers {
    getPlayers(): Promise<IUser[]>;
    updateNotes(email: string, item: Array<INotes>): Promise<void>;
}

export class FirebasePlayers implements IFirebasePlayers {
    private readonly userCollection: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

    constructor(private firebaseProps: IFirebase) {
        this.userCollection = this.firebaseProps.firestore.collection(FireStore_Collections.USERS);
    }


    async getPlayers(): Promise<IUser[]> {
        const playersQuery = firestore.query(
            firestore.collection(this.firebaseProps.firestore, FireStore_Collections.USERS),
            firestore.where('isPlayer', '==', true));
        const snapshot = await firestore.getDocs(playersQuery);
        const result: Array<IUser> = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            data["subscription_expiration_date"] = data["subscription_expiration_date"].toDate();
            data["birthday"] = data["birthday"].toDate();
            if (data["notes"]) {
                for (const note of data["notes"]) {
                    note["date"] = note["date"].toDate();
                }
            }
            result.push(<IUser>data);
        })
        return result;
    }

    async updateNotes(email: string, newNotes: Array<INotes>): Promise<void> {
        await this.userCollection.doc(email).update({
            notes: newNotes
        });
    }


}
