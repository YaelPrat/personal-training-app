import {Routes} from "@angular/router";
import {SignInComponent} from "./authentication/sign-in/sign-in.component";
import {SignUpComponent} from "./authentication/sign-up/sign-up.component";
import {ResetPasswordComponent} from "./authentication/reset-password/reset-password.component";
import {CalendarComponent} from "./main/calendar/calendar.component";
import {PlayersComponent} from "./main/players/players.component";
import {AboutComponent} from "./main/about/about.component";
import {ProfileComponent} from "./main/profile/profile.component";

export const NAVIGATION_URLS = {
    SIGN_IN: '/',
    SIGN_UP: '/sign-up',
    RESET_PASSWORD: '/reset_password',
    CALENDAR: '/calendar',
    PLAYERS: '/players',
    PROFILE: '/profile',
    ABOUT: '/about',
    VIDEOS: '/videos'
}

export const ROUTES: Routes = [
    {path: '', pathMatch: 'full', component: SignInComponent},
    {path: NAVIGATION_URLS.SIGN_UP.slice(1), pathMatch: 'full', component: SignUpComponent},
    {path: NAVIGATION_URLS.RESET_PASSWORD.slice(1), pathMatch: 'full', component: ResetPasswordComponent},
    {path: NAVIGATION_URLS.CALENDAR.slice(1), pathMatch: 'full', component: CalendarComponent},
    {path: NAVIGATION_URLS.PLAYERS.slice(1), pathMatch: 'full', component: PlayersComponent},
    {path: NAVIGATION_URLS.ABOUT.slice(1), pathMatch: 'full', component: AboutComponent},
    {path: NAVIGATION_URLS.PROFILE.slice(1), pathMatch: 'full', component: ProfileComponent},
    {path: '', redirectTo: NAVIGATION_URLS.SIGN_IN, pathMatch: 'full'}
]
