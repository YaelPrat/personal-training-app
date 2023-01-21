import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import * as moment from "moment";
import {NotificationService, notificationTypes} from "../../services/notification_service";
import {FirebaseService} from "../../services/firebase.service";
import {IUser} from "../../services/user.service";
import {NAVIGATION_URLS} from "../../Navigation-URLs";


const username_regex = /^[A-Za-z]{3,} [A-Za-z]{3,}$/
const email_regex = /(?:[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-z\d-]*[a-z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
const mediumPassword = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d))|((?=.*[A-Z])(?=.*\d)))(?=.{6,})/;
const phone_number = /^\+?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/im;

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
    maxDate: Date ;

    username: string = '';
    email: string = '';
    password: string = '';
    phoneNumber: string = '';
    confirmPassword: string = '';
    birthday: Date | null = null;

    passwordStrength = 0;


    constructor(private router: Router,
                private notificationService: NotificationService,
                private firebaseService: FirebaseService) {
                    this.maxDate = new Date();
    }

    ngOnInit(): void {
        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear()-14);
    }

    passwordChange() {
        const progressbar = document.getElementById('passwordStrength');
        if (this.password === '') {
            this.passwordStrength = 0;
            return;
        }
        if (progressbar) {
            if (strongPassword.test(this.password)) {
                this.passwordStrength = 100;
                progressbar.className = `progress-bar bg-success`;
            } else if (mediumPassword.test(this.password)) {
                this.passwordStrength = 50;
                progressbar.className = `progress-bar bg-warning`;
            } else {
                this.passwordStrength = 25;
                progressbar.className = `progress-bar bg-danger`;
            }
        }
    }

    async changePage(number: number) {
        switch (number) {
            case 1: {
                await this.router.navigateByUrl(NAVIGATION_URLS.SIGN_IN);
                break;
            }
            case 3: {
                await this.router.navigateByUrl(NAVIGATION_URLS.RESET_PASSWORD);
                break;
            }
        }
    }

    async handleSignup() {
        try {
            this.validateUsername();
            this.validateEmail()
            this.validateDate();
            this.validatePassword();
            this.validatePhoneNumber();
            const user_ = this.buildIUser();
            this.notificationService.createNotification(
                notificationTypes.info, 'Creating the account'
            );
            await this.firebaseService.authentication.signUp(this.email, this.password, user_);
            this.notificationService.createNotification(
                notificationTypes.info, 'Logging in...'
            );
            await this.firebaseService.authentication.signIn(this.email, this.password);
        } catch (e: any) {
            this.notificationService.createNotification(
                notificationTypes.error,
                e.message
            );
        }
    }

    validateUsername() {
        if (!username_regex.test(this.username)) {
            throw new Error('Invalid User Name Format, should be, First-name Last-name')
        }
    }

    validateDate() {
        const elem: any = document.getElementById('birthday_');
        const date = moment(elem.value, 'DD/MM/YYYY');
        if (!date.isValid()) {
            throw new Error('Invalid Date Format, use: DD/MM/YYYY')
        }
        this.birthday = date.toDate();
    }

    validateEmail() {
        if (!email_regex.test(this.email)) {
            throw new Error('Email is badly formatted');
        }
    }

    validatePhoneNumber() {
        if (!phone_number.test(this.phoneNumber)) {
            throw new Error('Phone number is badly formatted');
        }
    }

    validatePassword() {
        if (this.passwordStrength < 50) {
            throw new Error('Your password is not strong enough');
        }
        if (this.password !== this.confirmPassword) {
            throw new Error('Your passwords do not match');
        }
    }

    buildIUser(): IUser {
        const sex: any = document.getElementById('GenderDropdown');
        return {
            birthday: this.birthday!,
            isPlayer: true,
            notes: [],
            subscription_expiration_date: new Date(0),
            subscription_left: 0,
            email: this.email,
            phone: this.phoneNumber,
            name: this.username,
            sex: sex.value,
            trainer: false,
            receipts: [],
            image_link: 'https://firebasestorage.googleapis.com/v0/b/finalproject-baec3.appspot.com/o/profile_images%2Fdefault_profile_picture.png?alt=media&token=7bd931be-e344-4561-8c38-5b10256e8f83'
        };
    }
}
