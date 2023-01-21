import {onValue, ref, set} from "firebase/database";
import {IFirebase} from "../firebase.service";
import {cloneDeep} from "lodash";

export interface IFirebaseCalendar {
    addNewCalendar(newCalendar: any): Promise<void>;

    onChangeCalendars(updateCalendar: any): void;

    updateEntireCalendar(newDataSource: any): Promise<void>;
}

export class FirebaseCalendar implements IFirebaseCalendar {
    constructor(private firebaseProps: IFirebase) {
    }

    async addNewCalendar(newCalendar: any) {
        const copy = cloneDeep(newCalendar);
        copy.StartTime = newCalendar.StartTime.getTime()
        copy.EndTime = newCalendar.EndTime.getTime();
        await set(
            ref(this.firebaseProps.firebaseRealtime, `calendars/${copy.Id}`),
            copy
        )
    }

    onChangeCalendars(updateCalendar: any): void {
        onValue(ref(this.firebaseProps.firebaseRealtime, 'calendars/'), async (snapshot) => {
            const data = snapshot.val();
            const calendars: any = Object.values(data)
            for (let calendar of calendars) {
                calendar.StartTime = new Date(calendar.StartTime)
                calendar.EndTime = new Date(calendar.EndTime)
            }
           await updateCalendar(calendars);
        });
    }

    async updateEntireCalendar(newDataSource: any[]): Promise<any> {
        if (!newDataSource || newDataSource.length === 0)
            return;
        const newData: any = cloneDeep(newDataSource);
        for (let calendar of newData) {
            calendar.StartTime = calendar.StartTime.getTime();
            calendar.EndTime = calendar.EndTime.getTime();
            Object.keys(calendar).forEach(key => calendar[key] === undefined && delete calendar[key])
        }
        await set(ref(this.firebaseProps.firebaseRealtime, `calendars/`), newData);
    }
}
