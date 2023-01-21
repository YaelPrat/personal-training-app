import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowSelectedEvent} from "ag-grid-community";
import {GRID_COLUMNS} from "./notes-grid-configuration";
import {INotes, IUser} from "../../../../../services/user.service";
import {FirebaseService} from "../../../../../services/firebase.service";
import {NotificationService, notificationTypes} from "../../../../../services/notification_service";

@Component({
    selector: 'player-modal-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, AfterViewInit {
    columnDefs: ColDef[] = GRID_COLUMNS;

    private gridApi!: GridApi;
    private gridColumnApi!: ColumnApi;


    @Input() data!: IUser;
    noteText: string = '';

    isRemoveDisabled: boolean = true;
    isAddDisabled: boolean = true;

    constructor(private firebaseService: FirebaseService,
                private notificationService: NotificationService) {
    }

    ngOnInit(): void {
    }


    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    async addNote() {
        this.isAddDisabled = true;
        this.notificationService.createNotification(
            notificationTypes.info,
            'Adding new note...'
        );
        const item: INotes = {
            date: new Date(),
            note: this.noteText
        }
        this.data.notes.splice(0, 0, item);
        this.noteText = '';
        await this.firebaseService.players.updateNotes(this.data.email, this.data.notes);
        this.gridApi.setRowData(this.data.notes);
        this.notificationService.createNotification(
            notificationTypes.success,
            'Success'
        );
        this.isAddDisabled = false;
    }

    async removeNote() {
        this.isAddDisabled = true;
        this.notificationService.createNotification(
            notificationTypes.info,
            'Removing note...'
        );
        let t = this.gridApi.getSelectedNodes();
        const node = t.filter(node => node.isSelected())[0];
        this.data.notes = this.data.notes.filter(note =>
            !(note.date.getTime() === node.data.date.getTime()
            && note.note === node.data.note));
        this.isRemoveDisabled = true;
        await this.firebaseService.players.updateNotes(this.data.email, this.data.notes);
        this.notificationService.createNotification(
            notificationTypes.success,
            'Success'
        );
        this.isAddDisabled = false;
    }

    ngAfterViewInit(): void {
        let elems = document.querySelectorAll('player-modal-notes .ag-center-cols-container[role="rowgroup"]');
        elems.forEach((elem) => {
            if (!elem.className.includes('w-100')) {
                elem.className += ' w-100'
            }
        })
    }

    isRowSelected(_: RowSelectedEvent) {
        this.isRemoveDisabled = false;
    }
}
