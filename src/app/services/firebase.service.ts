import {Injectable} from '@angular/core';
import firebase from "firebase/compat/app";

import {environment} from "../../environments/environment";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import "firebase/compat/database";
import "firebase/compat/storage";
import {IFirebaseCalendar, FirebaseCalendar} from "./firebase-utilities/calendar";
import {IFirebaseAuthentication, FirebaseAuthentication} from "./firebase-utilities/authentication";
import {IFirebasePlayers, FirebasePlayers} from "./firebase-utilities/players";
import {IFirebaseUser, FirebaseUser} from "./firebase-utilities/user";

export const FireStore_Collections = {
    USERS: 'users'
};

export interface IFirebase {
    readonly firebaseAuth: firebase.auth.Auth;
    readonly firestore: firebase.firestore.Firestore;
    readonly firebaseRealtime: firebase.database.Database;
    readonly firestorage: firebase.storage.Storage;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private readonly firebaseApp: firebase.app.App;
    private readonly firebaseProperties: IFirebase;
    public readonly calendar: IFirebaseCalendar;
    public readonly authentication: IFirebaseAuthentication;
    public readonly players: IFirebasePlayers;
    public readonly user: IFirebaseUser;
    constructor() {
        this.firebaseApp = firebase.initializeApp(environment.firebaseConfig);
        this.firebaseProperties = {
            firebaseAuth: this.firebaseApp.auth(),
            firebaseRealtime: this.firebaseApp.database(),
            firestore: this.firebaseApp.firestore(),
            firestorage: this.firebaseApp.storage()
        }
        this.calendar = new FirebaseCalendar(this.firebaseProperties);
        this.authentication = new FirebaseAuthentication(this.firebaseProperties);
        this.players = new FirebasePlayers(this.firebaseProperties);
        this.user = new FirebaseUser(this.firebaseProperties);
    }
}
