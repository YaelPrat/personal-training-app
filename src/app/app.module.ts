import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {OverlayModule} from "@angular/cdk/overlay";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from './app.component';
import {SignInComponent} from './authentication/sign-in/sign-in.component';
import {CalendarComponent} from './main/calendar/calendar.component';
import {NavbarComponent} from './main/navbar/navbar.component';
import {ProfileComponent} from './main/profile/profile.component';
import {PlayersComponent} from './main/players/players.component';
import {CardComponent} from './main/players/player/card/card.component';
import {PlayerComponent} from './main/players/player/player.component';
import {ModalComponent} from './main/players/player/modal/modal.component';
import {SpinnerOverlayComponent} from './loading/spinner-overlay.component';
import {ResetPasswordComponent} from './authentication/reset-password/reset-password.component';
import {NotesComponent} from './main/players/player/modal/notes/notes.component';
import {SignUpComponent} from './authentication/sign-up/sign-up.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ToastContainerModule, ToastrModule} from "ngx-toastr";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";

import {AgGridModule} from 'ag-grid-angular';

import {ScheduleAllModule} from "@syncfusion/ej2-angular-schedule";
import {TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {ROUTES} from "./Navigation-URLs";
import { AboutComponent } from './main/about/about.component';
import { PaymentModalComponent } from './main/profile/payment-modal/payment-modal.component';
import { PaymentOptionComponent } from './main/profile/payment-modal/payment-option/payment-option.component';
import { ReceiptsModalComponent } from './main/profile/receipts-modal/receipts-modal.component';
import { ReceiptComponent } from './main/profile/receipts-modal/receipt/receipt.component';

const routes: Routes = ROUTES

@NgModule({
    declarations: [
        AppComponent,
        SignInComponent,
        NavbarComponent,
        CalendarComponent,
        ProfileComponent,
        PlayersComponent,
        CardComponent,
        PlayerComponent,
        ModalComponent,
        NotesComponent,
        SignUpComponent,
        SpinnerOverlayComponent,
        ResetPasswordComponent,
        AboutComponent,
        PaymentModalComponent,
        PaymentOptionComponent,
        ReceiptsModalComponent,
        ReceiptComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        ToastrModule.forRoot(
            {
                preventDuplicates: true,
                autoDismiss: true,
                positionClass: 'toast-top-center',
            }
        ),
        AgGridModule.withComponents({}),
        ToastContainerModule, OverlayModule,
        MatButtonModule, MatFormFieldModule,
        MatInputModule, MatCardModule,
        ReactiveFormsModule, MatIconModule,
        FormsModule, MatDividerModule,
        ScheduleAllModule, TextBoxAllModule,
        BrowserModule, RouterModule,
        MatDatepickerModule, MatNativeDateModule,
        ButtonAllModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
