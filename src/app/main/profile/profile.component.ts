import {Component, OnInit} from '@angular/core';
import {IUser, UserService} from "../../services/user.service";
import {NotificationService, notificationTypes} from "../../services/notification_service";


@Component({
    selector: 'main-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    currentUser!: IUser;
    isLoading: boolean = true;
    loadingMessage: string = '';

    constructor(private userService: UserService,
                private notificationService: NotificationService) {
    }

    async ngOnInit(): Promise<void> {
        this.loadingMessage = 'Loading your profile data';
        this.isLoading = true;
        await this.userService.waitForUser();
        this.currentUser = this.userService.user;
        this.isLoading = false;
    }

    getSubscriptionEndDate(): string {
        if (this.currentUser.subscription_expiration_date.getTime() === 0 && this.currentUser.subscription_left === 0) {
            return 'You Have No Subscription';
        }
        if (this.currentUser.subscription_expiration_date.getTime() === 0 && this.currentUser.subscription_left > 0) {
            return 'You Have One Time Subscription';
        }
        let diff_days = this.currentUser.subscription_expiration_date.getTime() - Date.now();
        diff_days = diff_days / (1000 * 3600 * 24);
        return this.currentUser.subscription_expiration_date.toLocaleDateString('en-GB') + ` | ${diff_days.toFixed(0)} days`;
    }

    takeProfilePicture(_: MouseEvent) {
        const elem = document.getElementById('change_profile_picture');
        if (elem)
            elem.click();
    }

    async changeProfilePicture(event: any) {
        const elem = document.getElementById('change_profile_picture');
        if (!elem)
            return;
        const reader = new FileReader();

        const fileToUpload: any = event.target?.files[0];
        reader.readAsDataURL(fileToUpload);
        reader.onload = async () => {
            this.loadingMessage = 'Updating Profile Picture';
            this.isLoading = true;
            this.notificationService.createNotification(
                notificationTypes.info,
                'Updating image'
            )
            const imgFile = reader.result as string;
            const imageType = imgFile.slice(5, imgFile.indexOf(';'));
            const data = imgFile.slice(imgFile.indexOf(',') + 1);
            await this.userService.updateProfilePicture(data, imageType);
            this.notificationService.createNotification(
                notificationTypes.success,
                'Your image been updated successfully'
            )
            this.isLoading = false;
        }
    }
}
