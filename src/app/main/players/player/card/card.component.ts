import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUser} from "../../../../services/user.service";


@Component({
    selector: 'player-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() data!: IUser;
    @Output() finishedLoading = new EventEmitter<boolean>();
    last_note = '';

    constructor() {
    }

    ngOnInit(): void {
        if (this.data.notes.length === 0) {
            this.last_note = 'No Notes';
            return;
        }
        this.last_note = this.data.notes[0].note;
        if (this.last_note.length > 20)
            this.last_note = this.last_note.slice(0, 20) + '...';
    }

    afterLoading() {
        this.finishedLoading.emit(true);
    }
}
