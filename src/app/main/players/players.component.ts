import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {IUser, UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {NAVIGATION_URLS} from "../../Navigation-URLs";


@Component({
    selector: 'main-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit, AfterViewInit {
    public data: IUser[] = [];
    isLoading: boolean = true;
    completed: number = 0;

    constructor(private firebaseService: FirebaseService,
                private userService: UserService,
                private router: Router) {

    }

    async ngOnInit(): Promise<void> {
        await this.userService.waitForUser();
        if (!this.userService.user.trainer) {
            await this.router.navigateByUrl(NAVIGATION_URLS.CALENDAR);
        }
    }

    ngAfterViewInit(): void {
        this.firebaseService.players.getPlayers().then((players) => {
            this.data = players;
        });
    }

    loading(_: boolean) {
        this.completed++;
        this.isLoading = this.completed < this.data.length;
    }
}
