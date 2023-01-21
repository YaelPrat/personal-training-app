import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../../services/user.service";

@Component({
    selector: 'player-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {


    @Input() data!: IUser;

    @Input() modal_id: string = '';

  



    constructor() {
    }

    ngOnInit(): void {
    }

    handleSave() {
        console.table(this.data);
    }


  


}
