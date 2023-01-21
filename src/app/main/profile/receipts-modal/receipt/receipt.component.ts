import {Component, Input, OnInit} from '@angular/core';
import {IReceipt} from "../../../../services/user.service";

@Component({
    selector: 'profile-receipts-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
    @Input() data!: IReceipt;

    constructor() {
    }

    ngOnInit(): void {
    }

}
