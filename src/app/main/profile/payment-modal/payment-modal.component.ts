import {Component, OnInit} from '@angular/core';
import {NotificationService, notificationTypes} from "../../../services/notification_service";
import {UserService} from "../../../services/user.service";
import {PaymentOptions} from "./payment-options";


const CC_regex = /^(?:4\d{12}(?:\d{3})?|[25][1-7]\d{14}|6(?:011|5\d\d)\d{12}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|(?:2131|1800|35\d{3})\d{11})$/;

@Component({
    selector: 'profile-payment-modal',
    templateUrl: './payment-modal.component.html',
    styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
    Pay: boolean = false;
    subscription: string = '';
    cardNumber: string = '';
    CVV: string = '';
    expirationDate: string = '';

    paymentOptions = PaymentOptions;
    private selectedSubId: number = -1;


    constructor(private notificationService: NotificationService, private userService: UserService) {
    }

    ngOnInit(): void {
    }

    validateInputs() {
        if (!this.cardNumber.match(CC_regex)) {
            throw new Error('Credit Card Number Format Is Incorrect');
        }

        if (!this.CVV.match(/^\d{3}$/)) {
            throw new Error('Credit Card CCV Format Is Incorrect');
        }

        if (!this.expirationDate.match(/^\d{2}\/\d{4}$/)) {
            throw new Error('Credit Expiration Date Format Is Incorrect');
        }
    }

    async ProcessPayment(_: MouseEvent) {
        try {
            this.Pay = true;
            this.validateInputs();
            document.getElementById('paymentModal_dismiss')?.click();
            await (new Promise((t) => setTimeout(t, 2_000)));
            await this.userService.buySubscription({
                exp_date: this.getOptionExpDate(),
                amount: this.paymentOptions[this.selectedSubId].amount
            });
            await this.userService.addReceipt({
                name: this.paymentOptions[this.selectedSubId].name,
                date: new Date(Date.now()),
                price: this.paymentOptions[this.selectedSubId].price,
                card_number: this.cardNumber,
                unique_id: Math.random().toString().slice(2, 10)
            });
            this.notificationService.createNotification(
                notificationTypes.success,
                'Payment was successful'
            );
        } catch (e: any) {
            this.notificationService.createNotification(notificationTypes.error, e.message);
        } finally {
            this.Pay = false;
        }
    }

    getOptionExpDate(): Date {
        if (this.selectedSubId === 0) {
            return new Date(0);
        }

        const one_day = 1000 * 60 * 60 * 24;
        const days = this.paymentOptions[this.selectedSubId].lastsFor?.split(' ')[0];
        return new Date(Date.now() + one_day * Number(days));
    }

    setSelected(cardId: number) {
        this.subscription = `${PaymentOptions[cardId].name} | ${PaymentOptions[cardId].price}`;
        this.selectedSubId = cardId;
    }
}
