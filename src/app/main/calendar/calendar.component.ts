import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TextBoxComponent} from '@syncfusion/ej2-angular-inputs';
import {ActionEventArgs,
    EventRenderedArgs,
    EventSettingsModel,
    PopupOpenEventArgs,
    ScheduleComponent,
    TimeScaleModel,
    View
} from '@syncfusion/ej2-angular-schedule';
import {Internationalization} from "@syncfusion/ej2-base";
import {
    getEventIndexById,
    getNewCellData,
    getTimeAsISO
} from "./calendar.helper";
import {NotificationService, notificationTypes} from "../../services/notification_service";
import {FirebaseService} from "../../services/firebase.service";
import {UserService} from "../../services/user.service";

export interface data {
    "Id": number;
    "Subject": string;
    "Location": string;
    "Price": number;
    "Open": boolean;
    "CurrentUser": string;
    "StartTime": Date;
    "EndTime": Date;
    "IsAllDay": boolean;
    "Guid": string;
    "RecurrenceException": string;
    RecurrenceID: number;
}

@Component({
    selector: 'main-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css',],
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class CalendarComponent implements OnInit, AfterViewInit {

    @ViewChild('scheduleObj') scheduleObj!: ScheduleComponent;
    @ViewChild('locationObj') titleObj!: TextBoxComponent;
    @ViewChild('priceObj') notesObj!: TextBoxComponent;

    private currentUser: string = '';

    public isLoading: boolean = true;

    public selected: data | undefined;

    public intl: Internationalization = new Internationalization();
    public views: View[] = ["Week"];
    public timeScale: TimeScaleModel = {enable: true, interval: 60, slotCount: 1};
    eventSettings: EventSettingsModel;

    constructor(private notificationService: NotificationService,
                protected firebaseService: FirebaseService,
                public userService: UserService) {
        this.eventSettings = {
            dataSource: []
        };
    }


    async ngOnInit(): Promise<void> {
        // remove the ej2 licence bar - sorry, we are on a student budget ...... ):
        document.getElementById('js-licensing')?.remove();
        await this.userService.waitForUser();
        this.firebaseService.calendar.onChangeCalendars(async (results: any) => {
            this.eventSettings = {
                dataSource: results
            };
            await this.userService.waitForUser();
            this.isLoading = false;
        });
        this.currentUser = this.userService.user.name;
    }

    async ngAfterViewInit() {
        await this.userService.waitForUser();
        this.scheduleObj.allowDragAndDrop = this.userService.user.trainer;
    }

    public async handleEventCreate(e: KeyboardEvent | MouseEvent) {
        if (e instanceof KeyboardEvent && e.key !== 'Enter') // enable add with enter feature for edit window.
            return;
        if (!this.scheduleObj)
            return;
        try {
            let addObj = getNewCellData(this.scheduleObj);
            if (addObj['StartTime'].getTime() - Date.now() <= 0) {
                throw new Error('You cannot create a session in the past');
            }
            addObj['Subject'] = this.userService.user.name;
            this.scheduleObj.closeQuickInfoPopup();
            await this.firebaseService.calendar.addNewCalendar(addObj);
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error, e.message);
        }
    }

    async handleEventChangeForAdmin($event: any) {
        try {
            const data = $event.data;
            const startTime = new Date(data.StartTime);
            const endTime = new Date(data.EndTime);
            if (startTime.getTime() - Date.now() <= 0) {
                throw new Error(`You cannot edit previous sessions`);
            }

            if (startTime.getHours() < 10 ||
                endTime.getHours() > 20 ||
                (endTime.getHours() === 20 && endTime.getMinutes() > 0)) {
                throw new Error(`Session's window is from 10:00 to 20:00`);
            }

            if (data['Subject'] !== this.userService.user.name) {
                throw new Error(`You cannot Edit other Trainers Sessions`);
            }
            if (!data.Open) {
                throw new Error('You cannot edit taken session');
            }
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error, e.message);
            $event.cancel = true;
        }
    }

    public getHeaderDetails(data: data | undefined) {
        if (!data)
            return '';
        return '  ' + this.intl.formatDate(data['StartTime'], {type: 'date', skeleton: 'full'}) + ' (' +
            this.intl.formatDate(data['StartTime'], {skeleton: 'hm'}) + ' - ' +
            this.intl.formatDate(data['EndTime'], {skeleton: 'hm'}) + ')';
    }


    private canEditSession(): void {
        if (!this.selected!.Open && this.selected!.CurrentUser !== this.currentUser) {
            throw new Error(`You're not the owner of this session`);
        }
        const current = new Date();
        if (current > this.selected!.StartTime) {
            throw new Error('You cannot take old session');
        }
        current.setHours(current.getHours() + 2);
        if (!this.selected!.Open && current > this.selected!.EndTime) {
            throw new Error('Its too late to cancel');
        }
    }

    async handleTakeSession(_: MouseEvent) {
        if (!this.selected || !this.scheduleObj) {
            return;
        }
        try {
            this.notificationService.createNotification(notificationTypes.info, 'Processing the request');
            if (this.selected.Open) {
                await this.userService.canTakeSession();
            }
            const index = getEventIndexById(this.scheduleObj, this.selected.Id);
            const events = this.scheduleObj.eventsData;
            const parent = events[index];
            if (parent['RecurrenceRule']) {
                // update parent
                if (parent['RecurrenceException']) {
                    events[index]['RecurrenceException'] += `,${getTimeAsISO(this.selected.StartTime)}`;
                } else {
                    events[index]['RecurrenceException'] = getTimeAsISO(this.selected.StartTime);
                }

                this.selected.Open = !this.selected.Open;
                this.selected.CurrentUser = this.currentUser;
                if (this.selected.Open) {
                    this.selected.CurrentUser = '';
                }
                if (this.selected.RecurrenceID !== this.selected.Id) {
                    events[index] = this.selected;
                } else {
                    this.selected.Id = Number(this.scheduleObj.getEventMaxID()) + 1;
                    this.selected.RecurrenceException = getTimeAsISO(this.selected.StartTime);
                    this.scheduleObj.eventsData.push(this.selected);
                }
            } else {
                events[index]["Open"] = !events[index]['Open'];
                events[index]["CurrentUser"] = this.currentUser;
                if (events[index]['Open'])
                    events[index]["CurrentUser"] = ''
            }
            await this.firebaseService.calendar.updateEntireCalendar(this.scheduleObj.eventsData);
            await this.userService.updateSession(this.selected?.Open)
            this.notificationService.createNotification(notificationTypes.success, 'Success');
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error, e.message);
        }
    }

    eventRender(e: EventRenderedArgs) {
        if (e.data['Open'])
            e.element.style.backgroundColor = '#44ae00';
        else
            e.element.style.backgroundColor = '#c03333';

        if (e.data['CurrentUser'] && e.data['CurrentUser'] === this.userService.user.name)
            e.element.style.backgroundColor = '#636c6d';


        if (e.data['CurrentUser'] === this.userService.user.name || this.userService.user.name === e.data['Subject']) {
            let node = document.createElement('div');
            node.className = 'player-session-name'
            node.innerText = `${e.data['CurrentUser'] ? e.data['CurrentUser'] : ''}`;
            // @ts-ignore
            e.element.querySelector('.e-appointment-details').appendChild(node);
        }
    }

    onPopupOpen($event: PopupOpenEventArgs) {
        try {
            if (this.userService.user.trainer) {
                if ($event.data && $event.data['Subject'])
                    $event.cancel = ($event.data['Subject'] !== this.userService.user.name);
                return;
            }
            $event.cancel = true;
            this.selected = <data>$event.data;
            if (!this.selected.Id)
                return;
            this.canEditSession();
            document.getElementById('lunchModalButton')?.click();
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error, e.message);
        }
    }

    async onActionBegin(event: any) {
        if (event.requestType === "eventChange" && this.userService.user.trainer) {
            await this.handleEventChangeForAdmin(event);
        }
    }

    async onActionComplete(args: ActionEventArgs) {
        if (args.requestType !== 'toolBarItemRendered')
            await this.firebaseService.calendar.updateEntireCalendar(this.scheduleObj.eventSettings.dataSource);
    }
}
