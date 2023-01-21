import {ColDef} from "ag-grid-community";

/**
 * This is where the columns data and format get defines.
 * field -- name of the column
 * valueFormatter -- how the data will look like (format wise)
 * max width -- cell max width.
 */
export const GRID_COLUMNS: ColDef[] = [
    {
        field: 'date',
        valueFormatter: (params: any) => params.value.toLocaleDateString(),
        maxWidth: 100,
    },
    {
        field: 'note',
        wrapText: true,
        autoHeight: true,
        minWidth: 400
    }
];



