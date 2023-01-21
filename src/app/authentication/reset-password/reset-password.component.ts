import {Component, OnInit} from '@angular/core';
import {NotificationService, notificationTypes} from "../../services/notification_service";
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";
import {NAVIGATION_URLS} from "../../Navigation-URLs";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    email: string = '';

    constructor(private firebaseService: FirebaseService,
                private router: Router,
                private notificationService: NotificationService) {
    }

    ngOnInit(): void {
    }

    async changePage(number: number) {
        switch (number) {
            case 1: {
                await this.router.navigateByUrl(NAVIGATION_URLS.SIGN_IN);
                break;
            }
            case 2: {
                await this.router.navigateByUrl(NAVIGATION_URLS.SIGN_UP);
                break;
            }
        }
    }

    async handleResetPassword() {
        try {
            this.notificationService.createNotification(
                notificationTypes.info,
                'Sending an email to you'
            );
            await this.firebaseService.authentication.resetPassword(this.email);
            this.notificationService.createNotification(
                notificationTypes.success,
                'Email was sent successfully'
            );
        } catch (e: any) {
            this.notificationService.createNotification(
                notificationTypes.error,
                e.message
            )
        }
    }
}
