import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService, notificationTypes} from "../../services/notification_service";
import {FirebaseService} from "../../services/firebase.service";
import {UserService} from "../../services/user.service";
import {NAVIGATION_URLS} from "../../Navigation-URLs";


@Component({
    selector: 'main-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    canViewPlayers: boolean = false;

    public Domains = NAVIGATION_URLS;

    constructor(private notificationService: NotificationService,
                private router: Router,
                private firebaseService: FirebaseService,
                private userService: UserService) {
    }

    async ngOnInit(): Promise<void> {
        await this.userService.waitForUser();
        this.canViewPlayers = this.userService.user.trainer;
    }

    async handleNavigation(page: string) {
        try {
            await this.router.navigateByUrl(page);
            this.notificationService.closeNotification();
        } catch {
            this.notificationService.createNotification(notificationTypes.info, 'Coming soon');
        }
    }

    async handleSignOut() {
        try {
            this.notificationService.createNotification(notificationTypes.info, 'Logging out');
            await this.firebaseService.authentication.signOut();
            this.notificationService.createNotification(notificationTypes.success, 'Logging out');
        } catch {
            this.notificationService.createNotification(notificationTypes.error, 'Failed to logout');
        }
    }
}
