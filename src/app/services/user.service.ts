import {Injectable} from "@angular/core";
import {NotificationService, notificationTypes} from "./notification_service";
import {FirebaseService} from "./firebase.service";

export interface INotes {
    date: Date,
    note: string
}

export interface IReceipt {
    card_number: string,
    date: Date,
    unique_id: string,
    price: string,
    name: string
}

export interface IUser {
    email: string;
    name: string;
    phone: string;
    birthday: Date;
    trainer: boolean;
    isPlayer: boolean;
    sex: string;
    notes: Array<INotes>;
    subscription_left: number;
    subscription_expiration_date: Date;
    image_link: string;
    receipts: Array<IReceipt>
}

@Injectable({
    providedIn: "root"
})
export class UserService {
    public user!: IUser;
    private readonly timeout: number = 600; // timeout for 1 minute
    private user_available: boolean = false;

    constructor(private notificationService: NotificationService,
                private firebaseService: FirebaseService) {
    }


    public async waitForUser(): Promise<void> {
        const checkUser = () => this.user_available && this.user;
        let time = 0;
        const condition = (resolve: any, reject: any) => {
            if (checkUser()) resolve();
            else setTimeout(() => condition(resolve, reject), 100);
            if (time++ === this.timeout) {
                reject('Failed to load user\'s data');
            }
        }
        try {
            await new Promise(condition);
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error, e);
        }
    }

    private async fetchUserData(email: string) {
        const temp: any = await this.firebaseService.authentication.getUserByEmail(email);
        temp.image_link = temp.image_link ?
            temp.image_link :
            'https://firebasestorage.googleapis.com/v0/b/finalproject-baec3.appspot.com/o/profile_images%2Fdefault_profile_picture.png?alt=media&token=7bd931be-e344-4561-8c38-5b10256e8f83';
        temp.subscription_expiration_date = temp.subscription_expiration_date.toDate();
        if (temp.receipts) {
            for (let elem of temp.receipts) {
                elem.date = elem.date.toDate();
            }
        }

        this.user = temp;
        this.user_available = true;
    }

    public async setUser(email: any) {
        await this.fetchUserData(email);
        await this.waitForUser();
        this.firebaseService.user.setCurrentUser(this.user);
    }


    async updateSession(increase: boolean): Promise<void> {
        await this.waitForUser();
        this.user.subscription_left += increase ? 1 : -1;
        await this.firebaseService.user.updateNumberOfSessionsLeft();
    }

    async canTakeSession() {
        if (this.user.subscription_expiration_date.getTime() === 0) {
            // bought one time subscription.
            if (this.user.subscription_left <= 0) {
                throw new Error('You have no subscriptions left...');
            }
            return;
        }
        const today = new Date();
        if (this.user.subscription_expiration_date.getTime() - today.getTime() <= 0) {
            throw new Error('Your subscription expired');
        }
        if (this.user.subscription_left <= 0) {
            throw new Error('You have no subscriptions left...');
        }
    }

    async buySubscription(data: { amount: number; exp_date: Date }) {
        const today = new Date();
        // *** check for previous subscription. ***
        if (this.user.subscription_expiration_date.getTime() - today.getTime() >= 0) {
            if (this.user.subscription_left > 0) {
                throw new Error('Your subscription is not yet expired');
            }
        }
        if (this.user.subscription_expiration_date.getTime() > 0) {
            this.user.subscription_left = 0;
        }
        this.user.subscription_expiration_date = data.exp_date;
        this.user.subscription_left += data.amount;
        await this.firebaseService.user.updateSubscription();
    }

    async addReceipt(data: IReceipt) {
        await this.firebaseService.user.addReceipt(data);
    }

    async updateProfilePicture(data: string, imageType: string) {
        await this.firebaseService.user.updateProfilePicture(data, imageType);
    }
}
