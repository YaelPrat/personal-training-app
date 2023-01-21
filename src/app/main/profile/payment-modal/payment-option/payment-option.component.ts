import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPaymentCardOption} from "../payment-options";

@Component({
    selector: 'profile-payment-modal-option',
    templateUrl: './payment-option.component.html',
    styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {
    @Output() selectCard: EventEmitter<number> = new EventEmitter<number>();
    @Input() data!: IPaymentCardOption;
    constructor() {
    }

    ngOnInit(): void {

    }

}
