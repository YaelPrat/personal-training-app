export interface IPaymentCardOption {
    name: string,
    lastsFor?: string,
    price: string,
    amount: number,
    id: number
}

export const PaymentOptions: Array<IPaymentCardOption> = [
    {
        name: 'Buy One',
        amount: 1,
        price: '200₪',
        id: 0
    }, {
        name: 'Pro I',
        lastsFor: '120 Days',
        price: '800₪',
        amount: 8,
        id: 1
    }, {
        name: 'Pro II',
        lastsFor: '180 Days',
        price: '1200₪',
        amount: 15,
        id: 2
    }
]
