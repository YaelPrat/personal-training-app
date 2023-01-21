import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastContainerDirective, ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {FirebaseService} from "./services/firebase.service";
import {UserService} from "./services/user.service";
import firebase from "firebase/compat/app";
import {NAVIGATION_URLS} from "./Navigation-URLs";
import {NotificationService, notificationTypes} from "./services/notification_service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild(ToastContainerDirective, {static: true})
    toastContainer: ToastContainerDirective | undefined;
    isLoading: boolean = true;

    constructor(private toaster: ToastrService,
                public router: Router,
                private firebaseService: FirebaseService,
                private userService: UserService,
                private notificationService: NotificationService) {
    }

    ngOnInit(): void {
        this.toaster.overlayContainer = this.toastContainer;
        this.firebaseService.authentication.setOnAuthStateChanged(async (user: firebase.User | null) => {
            try {
                this.isLoading = true;
                if (user) {
                    await this.userService.setUser(user.email);
                    if (this.showNavbar())
                        await this.router.navigateByUrl(this.router.url);
                    else
                        await this.router.navigateByUrl(NAVIGATION_URLS.CALENDAR);
                } else {
                    await this.router.navigateByUrl(NAVIGATION_URLS.SIGN_IN);
                }
            } catch (e: any) {
                this.notificationService.createNotification(
                    notificationTypes.error,
                    "Failed to load data " + e.message
                );
                if (user) {
                    await this.firebaseService.authentication.signOut();
                }
                await this.router.navigateByUrl(NAVIGATION_URLS.SIGN_IN);
            } finally {
                this.isLoading = false;
            }
        });
    }

    showNavbar(): boolean {
        return !(
            this.router.url === NAVIGATION_URLS.SIGN_IN ||
            this.router.url === NAVIGATION_URLS.SIGN_UP ||
            this.router.url === NAVIGATION_URLS.RESET_PASSWORD
        )
    }
}
