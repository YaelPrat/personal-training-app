import {FireStore_Collections, IFirebase} from "../firebase.service";
import firebase from "firebase/compat/app";
import {IReceipt, IUser} from "../user.service";
import FieldValue = firebase.firestore.FieldValue;
import {getDownloadURL,uploadString} from "firebase/storage";


export interface IFirebaseUser {
    setCurrentUser(currentUser: IUser): void;

    updateNumberOfSessionsLeft(): Promise<void>;

    updateSubscription(): Promise<void>;

    addReceipt(data: IReceipt): Promise<void>

    updateProfilePicture(data: string, contentType: string): Promise<void>;
}

export class FirebaseUser implements IFirebaseUser {
    private userCollection: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
    private currentUser!: IUser;

    constructor(private firebaseProperties: IFirebase) {
        this.userCollection = firebaseProperties.firestore.collection(FireStore_Collections.USERS);
    }

    setCurrentUser(currentUser: IUser): void {
        this.currentUser = currentUser;
    }

   
    async updateNumberOfSessionsLeft(): Promise<void> {
        await this.userCollection.doc(this.currentUser.email).update({
            'subscription_left': this.currentUser.subscription_left
        });
    }

    async updateSubscription(): Promise<void> {
        await this.userCollection.doc(this.currentUser.email).update({
            'subscription_expiration_date': this.currentUser.subscription_expiration_date,
            'subscription_left': this.currentUser.subscription_left
        });
    }

    async addReceipt(data: IReceipt): Promise<void> {
        // this shouldn't happen.
        if (!this.currentUser.receipts) {
            await this.userCollection.doc(this.currentUser.email).update({
                receipts: [data]
            });
            this.currentUser.receipts = [data];
            return;
        }
        this.currentUser.receipts.push(data);
        await this.userCollection.doc(this.currentUser.email).update({
            receipts: FieldValue.arrayUnion(data)
        });
    }

    async updateProfilePicture(data: string, contentType: string): Promise<void> {
        const image_path = this.firebaseProperties.firestorage.ref(`profile_images/${this.currentUser.email}`);
        await uploadString(image_path, data, 'base64', {
            contentType: contentType
        });
        const newImageLink = await getDownloadURL(image_path);
        this.currentUser.image_link = newImageLink;
        await this.userCollection.doc(this.currentUser.email).update({
            image_link: newImageLink
        });
    }
}
