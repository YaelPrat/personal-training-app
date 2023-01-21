import {FireStore_Collections, IFirebase} from "../firebase.service";
import firebase from "firebase/compat/app";
import {IUser} from "../user.service";


export interface IFirebaseAuthentication {
    signIn(username: string, password: string): Promise<void>;

    signOut(): Promise<void>;

    signUp(email: string, password: string, data: Object): Promise<void>;

    resetPassword(email: string): Promise<void>;

    setOnAuthStateChanged(func: any): void;

    getUserByEmail(email: string): Promise<IUser>;
}

export class FirebaseAuthentication implements IFirebaseAuthentication {
    private readonly usersCollection: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
    constructor(private firebaseProps: IFirebase) {
        this.usersCollection = this.firebaseProps.firestore.collection(FireStore_Collections.USERS);
    }

    async resetPassword(email: string): Promise<void> {
        await this.firebaseProps.firebaseAuth.sendPasswordResetEmail(email);
    }

    async signIn(username: string, password: string): Promise<void> {
        await this.firebaseProps.firebaseAuth.signInWithEmailAndPassword(
            username,
            password
        )
    }

    async signOut(): Promise<void> {
        await this.firebaseProps.firebaseAuth.signOut();
    }

    async signUp(email: string, password: string, data: Object): Promise<void> {
        await this.firebaseProps.firebaseAuth.createUserWithEmailAndPassword(
            email,
            password
        );
        await this.usersCollection.doc(email).set(data);
    }

    
    async setOnAuthStateChanged(func: any) {
       this.firebaseProps.firebaseAuth.onAuthStateChanged(func);
    }

    async getUserByEmail(email: string): Promise<IUser> {
        return <IUser>(await this.usersCollection.doc(email).get()).data();
    }
}
