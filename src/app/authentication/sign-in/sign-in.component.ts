import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FirebaseService} from "../../services/firebase.service";
import {NotificationService, notificationTypes} from "../../services/notification_service";
import {NAVIGATION_URLS} from "../../Navigation-URLs";


@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    email: string = "";
    password: string = "";
    isLoading: boolean = false;

    constructor(private router: Router,
                private firebaseService: FirebaseService,
                private notificationService: NotificationService) {
    }

    ngOnInit(): void {
    }

    async handleSignIn() {
        try {
            this.isLoading = true;
            await this.firebaseService.authentication.signIn(this.email, this.password);
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error,
                e.message);
        }
        this.isLoading = false;
    }

    async changePage(number: number) {
        switch (number) {
            case 2: {
                await this.router.navigateByUrl(NAVIGATION_URLS.SIGN_UP);
                break;
            }
            case 3: {
                await this.router.navigateByUrl(NAVIGATION_URLS.RESET_PASSWORD);
                break;
            }
        }
    }
}

