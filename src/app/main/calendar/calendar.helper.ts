import {
    CellClickEventArgs,
    EJ2Instance,
    EventRenderedArgs,
    ScheduleComponent
} from "@syncfusion/ej2-angular-schedule";
import {TextBoxComponent} from "@syncfusion/ej2-angular-inputs";


export function getNewCellData(scheduleObj: ScheduleComponent) {
    const quickPopup: HTMLElement = <HTMLElement>document.getElementsByClassName('e-quick-popup-wrapper').item(0);
    let cellDetails: CellClickEventArgs = scheduleObj.getCellDetails(scheduleObj.getSelectedElements());
    if (!cellDetails)
        cellDetails = scheduleObj.getCellDetails(<HTMLElement>scheduleObj.activeCellsData.element);

    // take input
    const location = ((quickPopup.querySelector('#location') as EJ2Instance).ej2_instances[0] as TextBoxComponent).value;

    // handle input
    if (!location) throw new Error('Missing field location');

    // set data in object
    const addObj: Record<string, any> = {};
    addObj['Id'] = scheduleObj.getEventMaxID();
    addObj['StartTime'] = new Date(cellDetails.startTime);
    addObj['EndTime'] = new Date(cellDetails.endTime);
    addObj['Open'] = true;
    addObj['Location'] = `Training in ${location}`;

    return addObj;
}


export function getEventIndexById(scheduleObj: ScheduleComponent, id: number): number {
    for (let i = 0; i < scheduleObj.eventsData.length; i++) {
        if (scheduleObj.eventsData[i]['Id'] === id)
            return i;
    }
    throw new Error(`Event not found by id, id = ${id}`);
}

export function getTimeAsISO(date: Date): string {
    let tt = date.toISOString()
        .replace(/[-:.]/g, '');
    tt = tt.slice(0, tt.length - 4) + 'Z';
    return tt;
}
