import {Component, Input, OnInit} from '@angular/core';
import {IReceipt} from "../../../services/user.service";

@Component({
    selector: 'profile-receipts-modal',
    templateUrl: './receipts-modal.component.html',
    styleUrls: ['./receipts-modal.component.css']
})
export class ReceiptsModalComponent implements OnInit {
    @Input() receipts: Array<IReceipt> = [];
    constructor() {
    }

    ngOnInit(): void {
    }

}
