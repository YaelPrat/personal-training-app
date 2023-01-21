import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUser} from "../../../services/user.service";

@Component({
    selector: 'players-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

    @Input() data!: IUser;
    @Input() player_id: number = 0;
    @Output() finishedLoading_ = new EventEmitter<boolean>();

    public modal_id: string = 'player_modal_id_';

    constructor() {
    }

    ngOnInit(): void {
        this.modal_id += this.player_id;
        this.data.notes = this.data.notes.sort((a, b)=> {
            return b.date.getTime() - a.date.getTime();
        });
    }

    finishedLoading(value: boolean) {
        this.finishedLoading_.emit(value);
    }
}
